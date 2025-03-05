const db = require('../config/db');

class UserService {
  static async findByEmail(email) {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return users[0];
  }

  static async findById(id) {
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return users[0];
  }

  static async create(userData) {
    const { fullname, email, contact, batch, password, role } = userData;
    const [result] = await db.query(
      'INSERT INTO users (fullname, email, contact, batch, password, role) VALUES (?, ?, ?, ?, ?, ?)',
      [fullname, email, contact, batch, password, role]
    );
    return result.insertId;
  }

  static async updateProfile(userId, userData) {
    const { fullname, email, contact, batch } = userData;
    const [result] = await db.query(
      'UPDATE users SET fullname = ?, email = ?, contact = ?, batch = ? WHERE id = ?',
      [fullname, email, contact, batch, userId]
    );
    return result.affectedRows > 0;
  }

  static async updatePassword(userId, newPassword) {
    const [result] = await db.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [newPassword, userId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = UserService;