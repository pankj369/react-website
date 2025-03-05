const db = require("../config/db");

const attendanceController = {
  // Check-in student
  checkIn: async (req, res) => {
    try {
      const { seatId } = req.body;
      const userId = req.user.id;

      // Check if seat is available
      const [seatCheck] = await db.query(
        "SELECT * FROM seats WHERE id = ? AND is_occupied = FALSE",
        [seatId]
      );

      if (seatCheck.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Seat is already occupied"
        });
      }

      // Check if student is already checked in
      const [activeAttendance] = await db.query(
        "SELECT * FROM attendance WHERE user_id = ? AND check_out IS NULL",
        [userId]
      );

      if (activeAttendance.length > 0) {
        return res.status(400).json({
          success: false,
          message: "You are already checked in"
        });
      }

      // Start transaction
      await db.query("START TRANSACTION");

      // Create attendance record
      await db.query(
        "INSERT INTO attendance (user_id, seat_id, check_in) VALUES (?, ?, NOW())",
        [userId, seatId]
      );

      // Update seat status
      await db.query(
        "UPDATE seats SET is_occupied = TRUE WHERE id = ?",
        [seatId]
      );

      await db.query("COMMIT");

      res.json({
        success: true,
        message: "Check-in successful"
      });
    } catch (error) {
      await db.query("ROLLBACK");
      res.status(500).json({
        success: false,
        message: "Error during check-in",
        error: error.message
      });
    }
  },

  // Check-out student
  checkOut: async (req, res) => {
    try {
      const userId = req.user.id;

      // Get active attendance record
      const [attendance] = await db.query(
        "SELECT * FROM attendance WHERE user_id = ? AND check_out IS NULL",
        [userId]
      );

      if (attendance.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No active check-in found"
        });
      }

      // Start transaction
      await db.query("START TRANSACTION");

      // Update attendance record
      await db.query(`
        UPDATE attendance 
        SET check_out = NOW(),
        duration = TIMESTAMPDIFF(MINUTE, check_in, NOW())
        WHERE id = ?`,
        [attendance[0].id]
      );

      // Free up the seat
      await db.query(
        "UPDATE seats SET is_occupied = FALSE WHERE id = ?",
        [attendance[0].seat_id]
      );

      await db.query("COMMIT");

      res.json({
        success: true,
        message: "Check-out successful"
      });
    } catch (error) {
      await db.query("ROLLBACK");
      res.status(500).json({
        success: false,
        message: "Error during check-out",
        error: error.message
      });
    }
  },

  // Get student's attendance history
  getAttendanceHistory: async (req, res) => {
    try {
      const userId = req.user.id;
      const { startDate, endDate } = req.query;

      let query = `
        SELECT a.*, s.seat_number, 
        DATE_FORMAT(a.check_in, '%Y-%m-%d %H:%i') as formatted_check_in,
        DATE_FORMAT(a.check_out, '%Y-%m-%d %H:%i') as formatted_check_out
        FROM attendance a
        JOIN seats s ON a.seat_id = s.id
        WHERE a.user_id = ?
      `;

      const params = [userId];

      if (startDate && endDate) {
        query += " AND DATE(a.check_in) BETWEEN ? AND ?";
        params.push(startDate, endDate);
      }

      query += " ORDER BY a.check_in DESC";

      const [history] = await db.query(query, params);

      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching attendance history",
        error: error.message
      });
    }
  }
};

module.exports = attendanceController;