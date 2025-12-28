// models/Gradebook.js
const mongoose = require("mongoose");
const GradebookSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  gradeId: { type: mongoose.Schema.Types.ObjectId, ref: "Grade", required: true },
  studentName: { type: String, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true }, // Adding this for easier lookup
  grades: { type: [Number], required: true },
  assignmentNames: { type: [String], default: [] }, // Store custom assignment names
});

// Add compound index for faster lookups and to prevent duplicates
GradebookSchema.index({ subjectId: 1, studentId: 1, gradeId: 1 }, { unique: true });

module.exports = mongoose.model("Gradebook", GradebookSchema);