const express = require('express');
const router = express.Router();
const focusSessionController = require('../controllers/focusController');
const verifyUser = require('../middleware/auth'); // Auth middleware

// Sabhi routes protected hain
router.use(verifyUser);

// Nayi session entry banayein
// POST /api/v1/focus/
router.post('/', focusSessionController.createFocusSession);

// User ki saari sessions fetch karein
// GET /api/v1/focus/
router.get('/', focusSessionController.getAllFocusSessions);

module.exports = router;
