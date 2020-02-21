const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gradeSchema = new Schema({
  level: {
    type: Number,
    required: true
  },
  subjects: [{
    type: Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  teachers: [{
    type: Schema.Types.ObjectId,
    ref: 'Teacher'
  }],
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }]
}, { timestamps: true });

const Grade = mongoose.model("Grade", gradeSchema);

module.exports = Grade;