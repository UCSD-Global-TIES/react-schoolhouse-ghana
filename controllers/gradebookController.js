const Gradebook = require("../models/Gradebook");
const fs = require("fs");
const fastcsv = require("fast-csv");
const Subject = require("../models/Subject");

// ✅ Fetch grades for a subject
// GET /api/subjects/:subjectId/gradebook
exports.getGradesBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    console.log(`🔹 Fetching Grades for Subject: ${subjectId}`);
    const entries = await Gradebook
      .find({ subjectId })
      .populate({path: "gradeId", select: "level"});
    console.log("📊 Gradebook entries with level:", entries);

    if (!entries.length) {
      console.log("❌ No grades found for this subject!");
      return res.status(404).json({ error: "No grades found" });
    }
    // console.log("✅ Grades Fetched:", entries);
    return res.json(entries);
  } catch (error) {
    console.error("❌ Error fetching grades:", error);
    return res.status(500).json({ error: "Error fetching grades" });
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
      await Gradebook.findOneAndUpdate(
        { subjectId, studentId, gradeId },
        { subjectId, studentId, studentName, grades, gradeId },
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
