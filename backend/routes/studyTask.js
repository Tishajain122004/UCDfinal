const express = require('express');
const router = express.Router();
const taskController = require('../controllers/studyTaskController');
const verifyUser = require('../middleware/auth'); // Auth middleware

// Saare routes protected hain
router.use(verifyUser);

// GET /api/v1/tasks/ - User ke saare tasks fetch karein
router.get('/', taskController.getAllTasks);

// POST /api/v1/tasks/ - Naya task banayein
router.post('/', taskController.createTask);

// PATCH /api/v1/tasks/:id - Task ko update karein (status, priority, subtasks)
router.patch('/:id', taskController.updateTask);

// DELETE /api/v1/tasks/:id - Task ko delete karein
router.delete('/:id', taskController.deleteTask);

module.exports = router;
