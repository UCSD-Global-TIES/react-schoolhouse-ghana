const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gradeSchema = new Schema({
  level: {
    type: Number,
    required: true
  },
  classes: [{
    type: Schema.Types.ObjectId,
    ref: 'Class'
  }],
  path: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Grade = mongoose.model("Grade", gradeSchema);

module.exports = Grade;