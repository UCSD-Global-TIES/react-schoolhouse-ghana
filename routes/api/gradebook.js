const express = require("express");
const Gradebook = require("../../models/Gradebook");
const router = express.Router();

// Fetch gradebook for a subject (auto-create if missing)
router.get("/:subjectId", async (req, res) => {
  try {
    let gradebook = await Gradebook.findOne({ class_id: req.params.subjectId });

    if (!gradebook) {
      console.warn(`No gradebook found for class_id: ${req.params.subjectId}. Creating a new one.`);
      gradebook = new Gradebook({
        class_id: req.params.subjectId,
        teacher_id: "unknown", // You can set this dynamically
        subject: "Unnamed Subject",
        students: [],
        columns: []
      });
      await gradebook.save();
    }

    res.json(gradebook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save or Update Gradebook (Handles missing students)
router.post("/update", async (req, res) => {
  try {
    const { class_id, students = [] } = req.body; // Default to empty array if missing

    let gradebook = await Gradebook.findOne({ class_id });

    if (!gradebook) {
      return res.status(404).json({ message: "Gradebook not found" });
    }

    gradebook.students = students;
    await gradebook.save();

    res.json({ message: "Gradebook updated successfully", gradebook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
