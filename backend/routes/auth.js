const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyUser = require('../middleware/auth');



    // === YEH LOG ADD KAREIN ===
    router.use('/create-profile', (req, res, next) => {
      console.log('>>> Request received for /create-profile');
      console.log('Headers:', JSON.stringify(req.headers, null, 2)); // Headers dekhne ke liye
      next(); // Request ko aage jaane dein
    });
    // ========================

// POST /api/v1/auth/create-profile
// Yeh route user ka token verify karega (verifyUser)
// Aur fir unka profile banayega (authController.createProfile)
router.post('/create-profile', verifyUser, authController.createProfile);

module.exports = router;