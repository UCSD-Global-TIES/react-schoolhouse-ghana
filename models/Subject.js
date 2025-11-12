const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  announcements: [{
    type: Schema.Types.ObjectId,
    ref: 'Announcement'
  }],
  students: [{ 
    type: Schema.Types.ObjectId, 
    ref: "Student" 
  }],
  files: [{
    type: Schema.Types.ObjectId,
    ref: 'File'
  }],
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }]
}, { timestamps: true });

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;