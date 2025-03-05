const db = require("../config/db");

const paymentController = {
  // Process payment
  processPayment: async (req, res) => {
    try {
      const { paymentId, referenceNumber } = req.body;
      const userId = req.user.id;

      const [payment] = await db.query(
        "SELECT * FROM payments WHERE id = ? AND user_id = ?",
        [paymentId, userId]
      );

      if (payment.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Payment not found"
        });
      }

      await db.query(
        "UPDATE payments SET status = 'completed', reference_number = ? WHERE id = ?",
        [referenceNumber, paymentId]
      );

      res.json({
        success: true,
        message: "Payment processed successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error processing payment",
        error: error.message
      });
    }
  },

  // Get payment history
  getPaymentHistory: async (req, res) => {
    try {
      const userId = req.user.id;

      const [payments] = await db.query(`
        SELECT p.*,
        CASE 
          WHEN p.payment_type = 'course_fee' THEN c.name
          WHEN p.payment_type = 'library_fee' THEN 'Library Fee'
          ELSE 'Fine'
        END as payment_for
        FROM payments p
        LEFT JOIN student_courses sc ON p.user_id = sc.user_id
        LEFT JOIN courses c ON sc.course_id = c.id
        WHERE p.user_id = ?
        ORDER BY p.payment_date DESC
      `, [userId]);

      res.json({
        success: true,
        data: payments
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching payment history",
        error: error.message
      });
    }
  },

  // Get pending payments
  getPendingPayments: async (req, res) => {
    try {
      const userId = req.user.id;

      const [pendingPayments] = await db.query(`
        SELECT * FROM payments 
        WHERE user_id = ? AND status = 'pending'
        ORDER BY payment_date DESC
      `, [userId]);

      res.json({
        success: true,
        data: pendingPayments
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching pending payments",
        error: error.message
      });
    }
  }
};

module.exports = paymentController;