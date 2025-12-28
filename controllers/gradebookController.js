const Gradebook = require("../models/Gradebook");
const fs = require("fs");
const fastcsv = require("fast-csv");
const Subject = require("../models/Subject");
const Grade = require("../models/Grade");
const Account = require("../models/Account");
const { verifyKey } = require("./verifyController");

// ✅ Fetch grades for a subject
// GET /api/subjects/:subjectId/gradebook
exports.getGradesBySubject = async (req, res) => {
  try {
    // Add authentication for students, teachers, and admins
    const isVerified = await verifyKey(req.header('Authorization'), 'Student,Teacher,Admin');
    if (!isVerified) {
      return res.status(403).json({ error: "Access denied" });
    }

    const { subjectId } = req.params;
    const userKey = req.header('Authorization');
    
    // Get user information to determine if this is a student request
    const userAccount = await Account.findById(userKey).populate('profile');
    const isStudentRequest = userAccount && userAccount.type === 'Student';

    console.log(`🔹 Fetching Gradebook for Subject: ${subjectId}, User Type: ${userAccount?.type || 'Unknown'}`);
    
    // If it's a student request, filter to only their grades
    if (isStudentRequest) {
      console.log(`📚 Student request - filtering for studentId: ${userAccount.profile._id}`);
      
      const existingGradebook = await Gradebook.find({ 
        subjectId, 
        studentId: userAccount.profile._id 
      }).populate({
        path: "gradeId",
        select: "level section",
      }).populate({
        path: "studentId",
        select: "first_name last_name",
      });

      console.log(`✅ Returning ${existingGradebook.length} gradebook entries for student`);
      return res.status(200).json(existingGradebook);
    }

    // For teachers/admins, continue with the full auto-population logic
    // Get the subject to find its grade level
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    // For teachers, find only the grades where they teach this subject
    // For admins, find all grades that contain this subject
    let gradeQuery = { 'subjectTeacherAssignments.subject': subjectId };
    
    if (userAccount?.type === 'Teacher') {
      // Only include grades where this teacher teaches this subject
      gradeQuery = {
        'subjectTeacherAssignments': {
          $elemMatch: {
            subject: subjectId,
            teacher: userAccount.profile._id
          }
        }
      };
      console.log(`🧑‍🏫 Teacher request - filtering for grades where teacher teaches this subject`);
    }

    let grades = await Grade.find(gradeQuery).populate({
      path: "students",
      select: "first_name last_name",
    }).sort({ level: 1, section: 1 }); // Sort by level then section for consistent ordering

    // If a specific gradeId is requested (from composite URL), filter to only that grade
    const requestedGradeId = req.query.gradeId;
    if (requestedGradeId) {
      console.log(`🔍 Specific grade requested: ${requestedGradeId}`);
      grades = grades.filter(g => g._id.toString() === requestedGradeId);
      if (grades.length === 0) {
        console.log(`⚠️ Requested grade ${requestedGradeId} not found or teacher doesn't teach it`);
        return res.status(200).json([]);
      }
    } else if (userAccount?.type === 'Teacher' && grades.length > 1) {
      // For teachers without explicit section params, only use the FIRST section
      // This prevents loading students from multiple sections when section isn't specified
      console.log(`⚠️ Teacher has ${grades.length} sections for this subject, using only the first section: Grade ${grades[0].level}${grades[0].section}`);
      grades = [grades[0]]; // Only use the first (earliest) section
    }

    if (!grades || grades.length === 0) {
      console.log("📝 No grades found for this subject");
      return res.status(200).json([]);
    }

    // Now fetch existing gradebook entries ONLY for the relevant grades
    // This prevents showing students from other sections (e.g. 1B when viewing 1A)
    const gradeIds = grades.map(g => g._id);
    const existingGradebook = await Gradebook.find({ 
      subjectId,
      gradeId: { $in: gradeIds }
    }).populate({
      path: "gradeId",
      select: "level section",
    }).populate({
      path: "studentId",
      select: "first_name last_name",
    });

    // Get list of students who already have gradebook entries
    const existingStudentIds = existingGradebook.map(entry => entry.studentId._id.toString());

    // Transform existing entries to include gradeInfo
    const existingWithGradeInfo = existingGradebook.map(entry => ({
      ...entry.toObject ? entry.toObject() : entry,
      gradeInfo: {
        level: entry.gradeId?.level || 0,
        section: entry.gradeId?.section || 'A'
      }
    }));

    // Process each grade section separately
    const placeholderEntries = [];
    let totalMissing = 0;
    
    for (const grade of grades) {
      // Find enrolled students in this grade section who don't have gradebook entries yet
      const missingStudents = grade.students.filter(student => 
        !existingStudentIds.includes(student._id.toString())
      );
      
      totalMissing += missingStudents.length;

      // Create placeholder entries for missing students with section information
      for (const student of missingStudents) {
        const placeholderEntry = {
          subjectId: subjectId,
          gradeId: grade._id,
          studentId: student._id,
          studentName: `${student.first_name} ${student.last_name}`,
          grades: [], // Empty grades array for new students
          _id: null, // Indicate this is a placeholder
          gradeInfo: { 
            level: grade.level,
            section: grade.section || 'A' // Include section for section-aware operations
          }
        };
        placeholderEntries.push(placeholderEntry);
      }
    }

    // Combine existing entries with placeholder entries and sort by grade level/section
    const allEntries = [...existingWithGradeInfo, ...placeholderEntries];
    
    // Sort entries by grade level, then section, then student name for consistent grouping
    allEntries.sort((a, b) => {
      const aLevel = a.gradeInfo?.level || a.gradeId?.level || 0;
      const bLevel = b.gradeInfo?.level || b.gradeId?.level || 0;
      const aSection = a.gradeInfo?.section || 'A';
      const bSection = b.gradeInfo?.section || 'A';
      const aName = a.studentName || '';
      const bName = b.studentName || '';
      
      if (aLevel !== bLevel) return aLevel - bLevel;
      if (aSection !== bSection) return aSection.localeCompare(bSection);
      return aName.localeCompare(bName);
    });

    console.log(`✅ Found ${existingGradebook.length} existing entries, added ${totalMissing} enrolled students across ${grades.length} grade sections`);
    return res.status(200).json(allEntries);
  } catch (error) {
    console.error("❌ Error fetching gradebook:", error);
    return res.status(500).json({ error: "Error fetching gradebook" });
  }
};
exports.getSubjectById = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }
    // only send back the fields you need
    return res.json({
      name: subject.name,
      gradeLevel: subject.gradeLevel,
      // …any other metadata you store on Subject
    });
  } catch (err) {
    console.error("❌ Error fetching subject:", err);
    return res.status(500).json({ error: "Error fetching subject" });
  }
};

// POST /api/subjects/:subjectId/gradebook
// expects req.body to have { entries: [...], assignmentNames: [...] }
exports.saveGradebook = async (req, res) => {
  try {
    // Add authentication - only teachers and admins can save gradebooks
    const isVerified = await verifyKey(req.header('Authorization'), 'Teacher,Admin');
    if (!isVerified) {
      return res.status(403).json({ error: "Access denied. Only teachers and admins can save gradebooks." });
    }

    const { subjectId } = req.params;
    // Handle both old format (array) and new format (object with entries and assignmentNames)
    const payload = req.body;
    let entries = Array.isArray(payload) ? payload : payload.entries || [];
    const assignmentNames = payload.assignmentNames || [];

    if (entries.length === 0) {
      return res.status(400).json({ error: "No gradebook data provided" });
    }

    // console.log(`🔹 Saving Gradebook for Subject: ${subjectId}`, entries);
    for (const entry of entries) {
      const { studentId, studentName, grades, gradeId } = entry;
      if (!studentId) {
        console.warn("⚠️  Skipping entry with no studentId:", entry);
        continue;
      }

      // Only save entries that have grades data or are updates to existing entries
      // Skip placeholder entries with empty grades arrays
      if (!grades || grades.length === 0 || grades.every(grade => grade === 0 || grade === "")) {
        // Check if this is an existing entry that needs to be updated
        const existingEntry = await Gradebook.findOne({ subjectId, studentId, gradeId: gradeId._id || gradeId });
        if (!existingEntry) {
          console.log(`⏭️  Skipping new entry with no grades for student: ${studentName}`);
          continue;
        }
      }

      // Extract gradeId properly whether it's an object or string
      const actualGradeId = gradeId._id || gradeId;
      
      await Gradebook.findOneAndUpdate(
        { subjectId, studentId, gradeId: actualGradeId },
        { 
          subjectId, 
          studentId, 
          studentName, 
          grades, 
          gradeId: actualGradeId,
          assignmentNames: assignmentNames // Save assignment names
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    // console.log("✅ Gradebook saved successfully!");
    return res.status(200).json({ message: "Gradebook saved successfully" });
  } catch (error) {
    console.error("❌ Error saving gradebook:", error);
    return res.status(500).json({ error: "Error saving gradebook" });
  }
};

// Export to CSV
exports.exportToCSV = async (req, res) => {
  try {
    const students = await Gradebook.find({ subjectId: req.params.subjectId });
    const csvStream = fastcsv.format({ headers: true });
    res.attachment("gradebook.csv");
    csvStream.pipe(res);
    students.forEach((student) => csvStream.write(student));
    csvStream.end();
  } catch (error) {
    res.status(500).json({ error: "Error exporting CSV" });
  }
};

// Import from CSV
exports.importFromCSV = async (req, res) => {
  try {
    let students = [];
    fs.createReadStream(req.file.path)
      .pipe(fastcsv.parse({ headers: true }))
      .on("data", (row) => students.push(row))
      .on("end", async () => {
        await Gradebook.insertMany(students);
        res.json({ message: "CSV Imported Successfully!" });
      });
  } catch (error) {
    res.status(500).json({ error: "Error importing CSV" });
  }
};

// ✅ Get gradebook entries filtered by grade section
// GET /api/subjects/:subjectId/gradebook/section/:level/:section
exports.getGradesBySection = async (req, res) => {
  try {
    // Add authentication for teachers and admins only (students shouldn't filter by section)
    const isVerified = await verifyKey(req.header('Authorization'), 'Teacher,Admin');
    if (!isVerified) {
      return res.status(403).json({ error: "Access denied" });
    }

    const { subjectId, level, section } = req.params;
    
    console.log(`🔹 Fetching Gradebook for Subject: ${subjectId}, Grade ${level} Section ${section}`);
    
    // Find the specific grade section
    const grade = await Grade.findOne({ 
      'subjectTeacherAssignments.subject': subjectId, 
      level: parseInt(level), 
      section: section.toUpperCase() 
    }).populate({
      path: "students",
      select: "first_name last_name",
    });

    if (!grade) {
      console.log(`📝 No grade found for Level ${level} Section ${section} in this subject`);
      return res.status(404).json({ error: "Grade section not found for this subject" });
    }

    // Get existing gradebook entries for this specific grade
    const existingGradebook = await Gradebook.find({ 
      subjectId, 
      gradeId: grade._id 
    }).populate({
      path: "studentId",
      select: "first_name last_name",
    });

    // Add gradeInfo to existing entries
    const existingWithGradeInfo = existingGradebook.map(entry => ({
      ...entry.toObject(),
      gradeInfo: {
        level: grade.level,
        section: grade.section || 'A'
      }
    }));

    // Get list of students who already have gradebook entries
    const existingStudentIds = existingGradebook.map(entry => entry.studentId._id.toString());

    // Find enrolled students who don't have gradebook entries yet
    const missingStudents = grade.students.filter(student => 
      !existingStudentIds.includes(student._id.toString())
    );

    // Create placeholder entries for missing students
    const placeholderEntries = [];
    for (const student of missingStudents) {
      const placeholderEntry = {
        subjectId: subjectId,
        gradeId: grade._id,
        studentId: student._id,
        studentName: `${student.first_name} ${student.last_name}`,
        grades: [], // Empty grades array for new students
        _id: null, // Indicate this is a placeholder
        gradeInfo: { 
          level: grade.level,
          section: grade.section || 'A'
        }
      };
      placeholderEntries.push(placeholderEntry);
    }

    // Combine and sort entries
    const allEntries = [...existingWithGradeInfo, ...placeholderEntries];
    allEntries.sort((a, b) => (a.studentName || '').localeCompare(b.studentName || ''));

    console.log(`✅ Found ${existingGradebook.length} existing entries, added ${placeholderEntries.length} students for Grade ${level} Section ${section}`);
    return res.status(200).json(allEntries);
  } catch (error) {
    console.error("❌ Error fetching gradebook by section:", error);
    return res.status(500).json({ error: "Error fetching gradebook by section" });
  }
};
