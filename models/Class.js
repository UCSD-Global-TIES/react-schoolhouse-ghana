const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  teachers: [{
    type: Schema.Types.ObjectId,
    ref: 'Teacher'
  }],
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }],
  announcements: [{
    type: Schema.Types.ObjectId,
    ref: 'Announcement'
  }],
  files: [{
    type: Schema.Types.ObjectId,
    ref: 'File'
  }],
  grade: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Grade'
  }
});

const Class = mongoose.model("Class", classSchema);

module.exports = Class;