const db = require("../config/db");

const User = {
  // Create new user
  createUser: (user, callback) => {
    const sql = `
      INSERT INTO users 
      (fullname, email, contact, batch, password, role) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
      sql, 
      [user.fullname, user.email, user.contact, user.batch, user.password, user.role || 'student'],
      callback
    );
  },

  // Find user by email
  findUserByEmail: (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], callback);
  },

  // Get user by ID
  findUserById: (id, callback) => {
    const sql = "SELECT id, fullname, email, contact, batch, role FROM users WHERE id = ?";
    db.query(sql, [id], callback);
  },

  // Update user details
  updateUser: (id, userData, callback) => {
    const sql = `
      UPDATE users 
      SET fullname = ?, email = ?, contact = ?, batch = ? 
      WHERE id = ?
    `;
    db.query(
      sql, 
      [userData.fullname, userData.email, userData.contact, userData.batch, id],
      callback
    );
  },

  // Get all users (for admin)
  getAllUsers: (callback) => {
    const sql = "SELECT id, fullname, email, contact, batch, role FROM users";
    db.query(sql, callback);
  }
};

module.exports = User;