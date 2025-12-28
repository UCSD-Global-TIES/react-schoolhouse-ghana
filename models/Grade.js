const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gradeSchema = new Schema({
  level: {
    type: Number,
    required: true
  },
  section: {
    type: String,
    required: true,
    default: 'A',
    uppercase: true,
    validate: {
      validator: function(v) {
        return /^[A-Z]$/.test(v); // Single uppercase letter
      },
      message: 'Section must be a single uppercase letter (A, B, C, etc.)'
    }
  },
  // Store subject-teacher assignments as an array of objects
  subjectTeacherAssignments: [{
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher'
    }
  }],
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }],
  status: {
    type: String,
    required: true,
    enum: ['active', 'unpublished', 'archived'],  
    default: 'active' 
  }
}, { timestamps: true });

// Add compound index for efficient queries and uniqueness
gradeSchema.index({ level: 1, section: 1 }, { unique: true });

const Grade = mongoose.model("Grade", gradeSchema);

module.exports = Grade;