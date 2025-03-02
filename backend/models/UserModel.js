const db = require("../config/db");

const User = {
  createUser: (user, callback) => {
    const sql = "INSERT INTO users (fullname, email, contact, batch, password, role) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [user.fullname, user.email, user.contact, user.batch, user.password, user.role], callback);
  },

  findUserByEmail: (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], callback);
  },
};

module.exports = User;
