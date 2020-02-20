const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  grade: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Grade'
  }
}, { timestamps: true });

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;