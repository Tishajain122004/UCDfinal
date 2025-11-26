const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');
const verifyUser = require('../middleware/auth'); // Auth Middleware

// Sabhi routes protected hain
router.use(verifyUser);

// User ke saare achievements fetch karein (Nayi 'Achievements' screen ke liye)
// GET /api/v1/rewards
router.get('/', rewardController.getMyAchievements);

module.exports = router;