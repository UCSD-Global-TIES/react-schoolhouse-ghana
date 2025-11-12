const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const announcementSchema = new Schema({
  authorName: {
    type: String,
    required: true
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  authorRole: {
    type: String,
    enum: ['Admin', 'Teacher'],
    required: true
  },
  targetAudience: {
    type: String,
    enum: ['both', 'teachers', 'students'],
    default: 'both'
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: "",
    required: true
  },
  private: {
    type: Boolean,
    default: true
  },
  files: [{
    type: Schema.Types.ObjectId,
    ref: 'File'
  }],
  subject: {
    type: Schema.Types.ObjectId,
    ref: 'Subject'
  },
  subjects: [{
    type: Schema.Types.ObjectId,
    ref: 'Subject'
  }]
}, { timestamps: true });

const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;