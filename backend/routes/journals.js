const express = require('express');
const router = express.Router();
const journalController = require('../controllers/JournalController');
const verifyUser = require('../middleware/auth'); // Auth middleware

// Sabhi routes protected hain
router.use(verifyUser);

// Nayi journal entry banayein
router.post('/', journalController.createJournalEntry);

// User ki sabhi journal entries fetch karein (filter ke saath)
router.get('/all', journalController.getAllJournalEntries);

// Sirf 3 recent entries fetch karein (main screen ke liye)
router.get('/recent', journalController.getRecentJournalEntries);

module.exports = router;
