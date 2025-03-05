const express = require('express');
const router = express.Router();
const borrowingController = require('../controllers/borrowingController');
const { protect } = require('../controllers/authController');

router.use(protect);

router.post('/borrow', borrowingController.borrowBook);
router.post('/return/:borrowId', borrowingController.returnBook);
router.get('/my-borrowings', borrowingController.getUserBorrowings);

module.exports = router;