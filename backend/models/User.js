const db = require('../config/db');

class User {
    static async findByEmail(email) {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async create(userData) {
        try {
            const { fullname, email, contact, batch, password, role } = userData;
            const [result] = await db.query(
                'INSERT INTO users (fullname, email, contact, batch, password, role) VALUES (?, ?, ?, ?, ?, ?)',
                [fullname, email, contact, batch, password, role || 'student']
            );
            return { id: result.insertId, ...userData };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;