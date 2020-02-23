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
  files: [{
    type: Schema.Types.ObjectId,
    ref: 'File'
  }]
}, { timestamps: true });

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;