const mongoose = require("mongoose");

const GradebookSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  studentName: { type: String, required: true },
  grades: { type: [Number], required: true },
});

module.exports = mongoose.model("Gradebook", GradebookSchema);
