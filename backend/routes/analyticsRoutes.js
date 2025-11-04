const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect routes with auth middleware
router.post('/today', authMiddleware, analyticsController.saveTodayAnalytics);
router.get('/weekly', authMiddleware, analyticsController.getWeeklyAnalytics);

module.exports = router;