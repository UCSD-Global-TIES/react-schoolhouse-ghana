const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const announcementSchema = new Schema({
  authorName: {
    type: String,
    required: true
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
  }]
}, { timestamps: true });

const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;