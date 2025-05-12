const Student = require("../models/Student");

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("profile");

    const flattened = students.map((s) => {
      if (!s.profile) return null;
      return {
        _id: s._id, // Gradebook will use this as studentId
        first_name: s.profile.first_name,
        last_name: s.profile.last_name,
        studentCode: s.profile.studentCode
      };
    }).filter(Boolean); // Remove any with missing profile

    res.json(flattened);
  } catch (err) {
    console.error("❌ Error fetching students:", err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};
