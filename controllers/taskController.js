const Task = require('../models/Task');
const Subject = require('../models/Subject');

const ip = require("ip")
const API_PORT = process.env.PORT || 3001;

module.exports = {
  createTask: async (req, res) => {
    try {
      console.log('[taskController.createTask] incoming', req.path, req.method, req.body);
      // Accept either `subjectId` (older clients) or `subject` (client sends subject)
      const { title, description, dueDate, subjectId, subject } = req.body;
      const subjectRef = subjectId || subject;

      if (!subjectRef) {
        return res.status(400).json({ error: 'Missing subject id' });
      }

      const task = new Task({ title, description, dueDate, subject: subjectRef });
      await task.save();

      const subj = await Subject.findById(subjectRef);
      if (subj) {
        subj.tasks.push(task._id);
        await subj.save();
      }

      res.status(201).json(task);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getTasks: async (req, res) => {
    try {
      console.log('[taskController.getTasks] params:', req.params);
      // Support either `subjectId` (routes use this) or legacy `sid`
      const subjectParam = req.params.subjectId || req.params.sid;
      const tasks = await Task.find({ subject: subjectParam });
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