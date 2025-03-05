const db = require('../config/db');

class BorrowingService {
  static async borrowBook(userId, bookId, dueDate) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Check book availability
      const [book] = await connection.query(
        'SELECT available FROM books WHERE id = ? FOR UPDATE',
        [bookId]
      );

      if (!book[0] || book[0].available <= 0) {
        throw new Error('Book not available');
      }

      // Create borrowing record
      const [result] = await connection.query(
        'INSERT INTO borrowings (book_id, user_id, due_date) VALUES (?, ?, ?)',
        [bookId, userId, dueDate]
      );

      // Update book availability
      await connection.query(
        'UPDATE books SET available = available - 1 WHERE id = ?',
        [bookId]
      );

      await connection.commit();
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async returnBook(borrowId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [borrowing] = await connection.query(
        'SELECT book_id FROM borrowings WHERE id = ? AND status = "borrowed"',
        [borrowId]
      );

      if (!borrowing[0]) {
        throw new Error('Invalid borrowing record');
      }

      await connection.query(
        'UPDATE borrowings SET status = "returned", return_date = NOW() WHERE id = ?',
        [borrowId]
      );

      await connection.query(
        'UPDATE books SET available = available + 1 WHERE id = ?',
        [borrowing[0].book_id]
      );

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getUserBorrowings(userId) {
    const [borrowings] = await db.query(
      `SELECT b.*, bk.title, bk.author 
       FROM borrowings b 
       JOIN books bk ON b.book_id = bk.id 
       WHERE b.user_id = ?
       ORDER BY b.borrow_date DESC`,
      [userId]
    );
    return borrowings;
  }
}

module.exports = BorrowingService;