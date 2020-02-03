const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const announcementSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'authorType'
  },
  authorType: {
    type: String,
    required: true
  },
  last_updated: {
    type: Date
  },
  date_created: {
    type: Date,
    default: Date.now
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
  }
});

const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;