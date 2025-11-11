const express = require('express');
const router = express.Router();
const taskController = require('../../controllers/taskController');

// Routes are defined relative to the mount point. api/index.js will mount this
// router at '/tasks' so the final paths will be '/api/tasks' and '/api/tasks/:taskId'.
router.post('/', taskController.createTask);
router.put('/:taskId', taskController.updateTask);
router.delete('/:taskId', taskController.deleteTask);

module.exports = router;