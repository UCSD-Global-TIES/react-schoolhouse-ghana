const express = require("express");
const Gradebook = require("../../models/Gradebook");
const router = express.Router();

// Fetch gradebook for a subject
router.get("/:subjectId", async (req, res) => {
  try {
    const gradebook = await Gradebook.findOne({ class_id: req.params.subjectId });
    if (!gradebook) return res.status(404).json({ message: "Gradebook not found" });
    res.json(gradebook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save or Update Gradebook
router.post("/update", async (req, res) => {
  try {
    const { class_id, students } = req.body;

    const gradebook = await Gradebook.findOne({ class_id });

    if (!gradebook) return res.status(404).json({ message: "Gradebook not found" });

    gradebook.students = students;
    await gradebook.save();

    res.json({ message: "Gradebook updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
