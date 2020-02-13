const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  classes: [{
    type: Schema.Types.ObjectId,
    ref: 'Class'
  }],
  grade: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Grade'
  }
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;