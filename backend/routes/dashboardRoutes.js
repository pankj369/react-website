const express = require('express');
const { getStudentDashboard, getAllStudents } = require('../controllers/dashboardController');
const { adminAuth } = require('../middleware/adminAuth');

const router = express.Router();

// Route to get student dashboard data
router.get('/student-dashboard', adminAuth, getStudentDashboard);

// New route to get all students
router.get('/students', adminAuth, getAllStudents);

module.exports = router;
