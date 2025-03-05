const router = require('express').Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/dashboard', verifyToken, dashboardController.getStudentDashboard);

module.exports = router;