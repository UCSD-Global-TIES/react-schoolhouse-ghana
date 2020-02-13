const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;