const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  studentUsername: { type: String, required: true },
  assignmentName: { type: String, required: true },
  grade: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Mark= mongoose.model('Mark', markSchema);

module.exports = Mark;