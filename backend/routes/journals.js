const express = require('express');
const router = express.Router();

// ===== YEH LINE FIX KI GAYI HAI =====
// 'journalController' ko 'JournalController' kiya (Capital J)
const journalController = require('../controllers/JournalController'); 
// ===================================

const verifyUser = require('../middleware/auth'); // Auth Middleware

// Sabhi routes protected hain
router.use(verifyUser);

// Nayi journal entry banayein
router.post('/', journalController.createJournalEntry);

// Sirf 3 recent entries fetch karein (main screen ke liye)
router.get('/recent', journalController.getRecentJournalEntries);

// User ki sabhi journal entries fetch karein (filter ke saath)
router.get('/all', journalController.getAllJournalEntries);

module.exports = router;

