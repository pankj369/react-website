const db = require('../config/db');

class Student {
    static async getAll() {
        try {
            const [rows] = await db.query('SELECT * FROM students');
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM students WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async create(studentData) {
        try {
            const { fullname, email, student_id, contact } = studentData;
            const [result] = await db.query(
                'INSERT INTO students (fullname, email, student_id, contact) VALUES (?, ?, ?, ?)',
                [fullname, email, student_id, contact]
            );
            return { id: result.insertId, ...studentData };
        } catch (error) {
            throw error;
        }
    }

    static async update(id, studentData) {
        try {
            const [result] = await db.query(
                'UPDATE students SET ? WHERE id = ?',
                [studentData, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const [result] = await db.query('DELETE FROM students WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async findByEmail(email) {
        try {
            const [rows] = await db.query('SELECT * FROM students WHERE email = ?', [email]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async search(query) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM students WHERE fullname LIKE ? OR email LIKE ? OR student_id LIKE ?',
                [`%${query}%`, `%${query}%`, `%${query}%`]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Student;