const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema({
  nickname: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  path: {
    type: String
  },
  last_updated: {
    type: Date
  },
  date_created: {
    type: Date,
    default: Date.now
  }
});

const File = mongoose.model("File", fileSchema);

// Populate nickname with filename if left blank

module.exports = File;