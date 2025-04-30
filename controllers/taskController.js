const Task = require('../models/Task');
const Subject = require('../models/Subject');

const ip = require("ip")
const API_PORT = process.env.PORT || 3001;

module.exports = {
  createTask: async (req, res) => {
    try {
      const { title, description, dueDate, subjectId } = req.body;
      const task = new Task({ title, description, dueDate, subject: subjectId });
      await task.save();

      const subject = await Subject.findById(subjectId);
      subject.tasks.push(task._id);
      await subject.save();

      res.status(201).json(task);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getTasks: async (req, res) => {
    try {
      const tasks = await Task.find({ subject: req.params.sid });
      res.status(200).json(tasks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateTask: async (req, res) => {
    try {
      const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true });
      res.status(200).json(task);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.taskId);
      const subject = await Subject.findById(task.subject);
      subject.tasks.pull(task._id);
      await subject.save();

      res.status(200).json({ message: 'Task deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};