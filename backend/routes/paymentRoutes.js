const router = require('express').Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/process', verifyToken, paymentController.processPayment);
router.get('/history', verifyToken, paymentController.getPaymentHistory);
router.get('/pending', verifyToken, paymentController.getPendingPayments);

module.exports = router;