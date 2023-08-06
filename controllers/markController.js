const Mark = require("../models/Mark"); 

exports.createMark = async (req, res) => {
  try {
    const { studentName, assignmentName, grade } = req.body;

    const newMark = new Mark({
      studentName,
      assignmentName,
      grade,
    });

    await newMark.save();

    res.status(201).json({ success: true, message: 'Mark saved successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error saving mark.' });
  }
};
