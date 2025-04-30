const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  dueDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  subject: {
    type: Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;