const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const objSchema = new Schema({
  author: {
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

const Obj = mongoose.model("Obj", objSchema);

module.exports = Obj;