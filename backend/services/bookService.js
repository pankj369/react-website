const db = require('../config/db');

class BookService {
  static async findAll() {
    const [books] = await db.query('SELECT * FROM books');
    return books;
  }

  static async findById(id) {
    const [books] = await db.query('SELECT * FROM books WHERE id = ?', [id]);
    return books[0];
  }

  static async create(bookData) {
    const { title, author, isbn, quantity, category, active } = bookData;
    const status = active ? 'available' : 'unavailable';
    const [result] = await db.query(
      'INSERT INTO books (title, author, isbn, quantity, available, category, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, author, isbn, quantity, quantity, category, status]
    );
    return result.insertId;
  }

  static async update(id, bookData) {
    const { title, author, isbn, quantity, category, active } = bookData;
    const status = active ? 'available' : 'unavailable';
    const [result] = await db.query(
      'UPDATE books SET title = ?, author = ?, isbn = ?, quantity = ?, category = ?, status = ? WHERE id = ?',
      [title, author, isbn, quantity, category, status, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM books WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async updateAvailability(id, available) {
    const [result] = await db.query(
      'UPDATE books SET available = ? WHERE id = ?',
      [available, id]
    );
    return result.affectedRows > 0;
  }

  static async findByStatus(status) {
    const [books] = await db.query('SELECT * FROM books WHERE status = ?', [status]);
    return books;
  }

  static async search(query) {
    const [books] = await db.query(
      'SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR isbn LIKE ?',
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    return books;
  }

  static async checkAvailability(id) {
    const [books] = await db.query(
      'SELECT available FROM books WHERE id = ?',
      [id]
    );
    return books[0]?.available || 0;
  }
}

module.exports = BookService;