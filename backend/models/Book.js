const db = require('../config/db');

class Book {
    static async getAll() {
        try {
            const [rows] = await db.query('SELECT * FROM books');
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async create(bookData) {
        try {
            const { title, author, isbn, category, quantity, location } = bookData;
            const [result] = await db.query(
                'INSERT INTO books (title, author, isbn, category, quantity, available_quantity, location) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [title, author, isbn, category, quantity, quantity, location]
            );
            return { id: result.insertId, ...bookData };
        } catch (error) {
            throw error;
        }
    }

    static async update(id, bookData) {
        try {
            const [result] = await db.query(
                'UPDATE books SET ? WHERE id = ?',
                [bookData, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const [result] = await db.query('DELETE FROM books WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async updateQuantity(id, quantity) {
        try {
            const [result] = await db.query(
                'UPDATE books SET available_quantity = ? WHERE id = ?',
                [quantity, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async search(query) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR isbn LIKE ?',
                [`%${query}%`, `%${query}%`, `%${query}%`]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Book;