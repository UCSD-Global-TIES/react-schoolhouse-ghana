const Gradebook = require("../models/Gradebook");
const fs = require("fs");
const fastcsv = require("fast-csv");

// ✅ Fetch grades for a subject
exports.getGradesBySubject = async (req, res) => {
    try {
      console.log("🔹 Fetching Grades for Subject:", req.params.subjectId);
  
      // ✅ Ensure the query matches how data is stored
      const grades = await Gradebook.find({ subjectId: req.params.subjectId });
  
      if (!grades.length) {
        console.log("❌ No grades found for this subject!");
        return res.status(404).json({ error: "No grades found" });
      }
  
      console.log("✅ Grades Fetched:", grades);
      
      res.json(grades);
    } catch (error) {
      console.error("❌ Error fetching grades:", error);
      res.status(500).json({ error: "Error fetching grades" });
    }
  };
  
  
  
  // ✅ Save gradebook data (overwrite existing records)
  exports.saveGradebook = async (req, res) => {
    try {
      console.log("🔹 Incoming Save Request:", req.body);
  
      if (!req.body.students || req.body.students.length === 0) {
        return res.status(400).json({ error: "No students provided" });
      }
  
      // ✅ Instead of deleting everything, update existing records or insert new ones
      for (let student of req.body.students) {
        await Gradebook.findOneAndUpdate(
          { subjectId: req.body.subject_id, studentName: student.studentName },
          { grades: student.grades,subjectId: req.body.subjectId },
          { upsert: true, new: true }
        );
      }
  
      console.log("✅ Gradebook saved successfully!");
      res.status(201).json({ message: "Gradebook saved successfully!" });
    } catch (error) {
      console.error("❌ Error Saving Gradebook:", error);
      res.status(500).json({ error: "Error saving gradebook" });
    }
  };
  
  
// // Save gradebook data
// exports.saveGradebook = async (req, res) => {
//   try {
//     await Gradebook.deleteMany({ subjectId: req.body.subjectId });
//     await Gradebook.insertMany(req.body.students);
//     res.json({ message: "Gradebook saved successfully!" });
//   } catch (error) {
//     res.status(500).json({ error: "Error saving gradebook" });
//   }
// };

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
