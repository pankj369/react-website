const db = require('../config/db');

class AttendanceService {
  static async checkIn(userId) {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if already checked in today
    const [existing] = await db.query(
      'SELECT * FROM attendance WHERE user_id = ? AND date = ?',
      [userId, today]
    );

    if (existing.length > 0) {
      throw new Error('Already checked in today');
    }

    const [result] = await db.query(
      'INSERT INTO attendance (user_id, check_in, date) VALUES (?, NOW(), ?)',
      [userId, today]
    );

    return result.insertId;
  }

  static async checkOut(userId) {
    const today = new Date().toISOString().split('T')[0];
    
    const [result] = await db.query(
      'UPDATE attendance SET check_out = NOW() WHERE user_id = ? AND date = ? AND check_out IS NULL',
      [userId, today]
    );

    if (result.affectedRows === 0) {
      throw new Error('No active check-in found');
    }

    return true;
  }

  static async getUserAttendance(userId, startDate, endDate) {
    const [attendance] = await db.query(
      `SELECT * FROM attendance 
       WHERE user_id = ? 
       AND date BETWEEN ? AND ?
       ORDER BY date DESC`,
      [userId, startDate, endDate]
    );
    return attendance;
  }
}

module.exports = AttendanceService;