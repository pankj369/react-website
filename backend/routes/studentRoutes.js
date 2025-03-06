const router = require('express').Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Student routes
router.get('/students', auth, adminAuth, studentController.getAllStudents);
router.get('/students/:id', auth, adminAuth, studentController.getStudentById);
router.post('/students', auth, adminAuth, studentController.createStudent);
router.put('/students/:id', auth, adminAuth, studentController.updateStudent);
router.delete('/students/:id', auth, adminAuth, studentController.deleteStudent);
router.get('/students/search/:query', auth, adminAuth, studentController.searchStudents);

module.exports = router;