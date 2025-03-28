const express = require('express');
const router = express.Router();
const { registerForEvent } = require('../controllers/eventRegistrationController');

// Route to handle event registration
router.post('/register', registerForEvent);

module.exports = router;
