const Mark = require("../models/Marks"); 

// Create a new mark
exports.createMark = async (req, res) => {
  try {
    const { studentUsername, assignmentName, grade, subject } = req.body;

    if (!studentUsername || !assignmentName || !subject || grade === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Student Name, Assignment Name, Subject, and Grade are required fields.',
      });
    }

    const newMark = new Mark({
      studentUsername,
      assignmentName,
      grade,
      subject
    });

    await newMark.save();

    res.status(201).json({ success: true, message: 'Mark saved successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error saving mark.' });
  }
};

// Get all marks
exports.getMarks = async (req, res) => {
  try {
    const marks = await Mark.find();

    res.status(200).json({ success: true, data: marks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching marks.' });
  }
};

// Get a specific mark by ID
exports.getMark = async (req, res) => {
  try {
    const mark = await Mark.findById(req.params.id);

    if (!mark) {
      return res.status(404).json({ success: false, message: 'Mark not found.' });
    }

    res.status(200).json({ success: true, data: mark });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching mark.' });
  }
};

// Update a specific mark by ID
exports.updateMark = async (req, res) => {
  try {
    const updatedMark = await Mark.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedMark) {
      return res.status(404).json({ success: false, message: 'Mark not found.' });
    }

    res.status(200).json({ success: true, data: updatedMark });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating mark.' });
  }
};

// Delete a specific mark by ID
exports.deleteMark = async (req, res) => {
  try {
    const deletedMark = await Mark.findByIdAndRemove(req.params.id);

    if (!deletedMark) {
      return res.status(404).json({ success: false, message: 'Mark not found.' });
    }

    res.status(200).json({ success: true, message: 'Mark deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error deleting mark.' });
  }
  
};

exports.getMarksByUsername= async (req, res) => {
  try {
      const marks = await Mark.find({ studentUsername: req.params.username });
      if (marks) {
          console.log(marks);
          res.json(marks);
      } else {
          res.status(404).send("Marks not found for this username");
      }
  } catch (error) {
      res.status(500).send("Server error");
  }
}

