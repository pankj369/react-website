const express = require('express');
const { registerStudent } = require('../controllers/studentRegistrationController');

const router = express.Router();
const { registerForEvent } = require('../controllers/eventRegistrationController');

// Route to handle event registration
router.post('/register', registerForEvent);
router.post('/register-student', registerStudent);


module.exports = router;
