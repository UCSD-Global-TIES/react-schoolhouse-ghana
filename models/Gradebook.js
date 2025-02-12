const mongoose = require("mongoose");

const GradebookSchema = new mongoose.Schema({
  class_id: { type: String, required: true },
  teacher_id: { type: String, required: true },
  subject: { type: String, required: true },
  students: [
    {
      student_id: String,
      name: String,
      grades: Object, // { "Assignment 1": { score: 18, max_score: 20 } }
      total: Number,
      letter_grade: String
    }
  ],
  columns: [{ name: String, max_score: Number }]
});

module.exports = mongoose.model("Gradebook", GradebookSchema);
