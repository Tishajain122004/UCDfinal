const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const verifyUser = require('../middleware/auth'); // Auth Middleware

// Sabhi routes protected hain
router.use(verifyUser);

// Ek group ke saare messages fetch karein
// GET /api/v1/chat/:group_id
router.get('/:group_id', chatController.getMessagesForGroup);

// Naya message bhej/save karein
// POST /api/v1/chat
router.post('/', chatController.sendMessage);

module.exports = router;
