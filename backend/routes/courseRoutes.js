const router = require('express').Router();
const courseController = require('../controllers/courseController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/enroll', verifyToken, courseController.enrollCourse);
router.get('/my-courses', verifyToken, courseController.getMyCourses);

module.exports = router;