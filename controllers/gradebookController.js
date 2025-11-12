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
    
    // First, get the existing gradebook entries
    let query = { subjectId };
    
    // If it's a student request, filter to only their grades
    if (isStudentRequest) {
      query.studentId = userAccount.profile._id; // Student's profile ID
      console.log(`📚 Student request - filtering for studentId: ${userAccount.profile._id}`);
    }
    
    const existingGradebook = await Gradebook.find(query).populate({
      path: "gradeId",
      select: "level",
    }).populate({
      path: "studentId",
      select: "first_name last_name",
    });

    // For students, return only their existing gradebook entries (no auto-population)
    if (isStudentRequest) {
      console.log(`✅ Returning ${existingGradebook.length} gradebook entries for student`);
      return res.status(200).json(existingGradebook);
    }

    // For teachers/admins, continue with the full auto-population logic
    // Get the subject to find its grade level
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    // Find the grade that contains this subject to get enrolled students
    const grade = await Grade.findOne({ subjects: subjectId }).populate({
      path: "students",
      select: "first_name last_name",
    });

    if (!grade) {
      console.log("📝 No grade found for this subject, returning existing gradebook only");
      return res.status(200).json(existingGradebook);
    }

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
        gradeId: { level: grade.level } // Manually add grade level for consistency
      };
      placeholderEntries.push(placeholderEntry);
    }

    // Combine existing entries with placeholder entries
    const allEntries = [...existingGradebook, ...placeholderEntries];

    console.log(`✅ Found ${existingGradebook.length} existing entries, added ${placeholderEntries.length} enrolled students`);
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
// expects req.body to be an array of gradebook objects
exports.saveGradebook = async (req, res) => {
  try {
    // Add authentication - only teachers and admins can save gradebooks
    const isVerified = await verifyKey(req.header('Authorization'), 'Teacher,Admin');
    if (!isVerified) {
      return res.status(403).json({ error: "Access denied. Only teachers and admins can save gradebooks." });
    }

    const { subjectId } = req.params;
    const entries = req.body;
    if (!Array.isArray(entries) || entries.length === 0) {
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
        { subjectId, studentId, studentName, grades, gradeId: actualGradeId },
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
