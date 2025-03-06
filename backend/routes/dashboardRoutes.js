const router = require('express').Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/authMiddleware');
const auth = require('../middleware/auth');

router.get('/dashboard', verifyToken, dashboardController.getStudentDashboard);

router.get('/student/stats', auth, dashboardController.getStudentStats);
router.get('/admin/stats', auth, dashboardController.getAdminStats);
router.get('/student/books', auth, dashboardController.getStudentBooks);
router.get('/student/borrowings', auth, dashboardController.getStudentBorrowings);
router.get('/student/attendance', auth, dashboardController.getStudentAttendance);

module.exports = router;