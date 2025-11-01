const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const verifyUser = require('../middleware/auth'); // Auth Middleware

// Sabhi routes protected hain
router.use(verifyUser);

// Naya group banayein
// POST /api/v1/groups
router.post('/', groupController.createGroup);

// Public groups dhoondhein (Discover)
// GET /api/v1/groups/public
router.get('/public', groupController.getAllPublicGroups);

// User ke apne groups
// GET /api/v1/groups/my-groups
router.get('/my-groups', groupController.getMyGroups);

// Ek group join karein
// POST /api/v1/groups/join
router.post('/join', groupController.joinGroup);

// Ek group chhodein
// DELETE /api/v1/groups/leave/:group_id
router.delete('/leave/:group_id', groupController.leaveGroup);

module.exports = router;

