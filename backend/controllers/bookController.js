const db = require('../config/db');

const bookController = {
  // Get all books
  getAllBooks: async (req, res) => {
    try {
      const [books] = await db.query('SELECT * FROM books ORDER BY title');
      res.json({
        success: true,
        books
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch books',
        error: error.message
      });
    }
  },

  // Add new book (admin only)
  addBook: async (req, res) => {
    try {
      const { title, author, isbn, category, quantity, description, coverImage } = req.body;

      // Validate ISBN
      const [existingBook] = await db.query('SELECT * FROM books WHERE isbn = ?', [isbn]);
      if (existingBook.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Book with this ISBN already exists'
        });
      }

      const [result] = await db.query(
        'INSERT INTO books (title, author, isbn, category, quantity, available_quantity, description, cover_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [title, author, isbn, category, quantity, quantity, description, coverImage]
      );

      res.status(201).json({
        success: true,
        message: 'Book added successfully',
        bookId: result.insertId
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to add book',
        error: error.message
      });
    }
  },

  // Update book (admin only)
  updateBook: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, author, category, quantity, description, coverImage } = req.body;

      const [existingBook] = await db.query('SELECT * FROM books WHERE id = ?', [id]);
      if (existingBook.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Book not found'
        });
      }

      // Calculate new available quantity
      const quantityDiff = quantity - existingBook[0].quantity;
      const newAvailableQuantity = existingBook[0].available_quantity + quantityDiff;

      if (newAvailableQuantity < 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot reduce quantity below number of books issued'
        });
      }

      await db.query(
        'UPDATE books SET title = ?, author = ?, category = ?, quantity = ?, available_quantity = ?, description = ?, cover_image = ? WHERE id = ?',
        [title, author, category, quantity, newAvailableQuantity, description, coverImage, id]
      );

      res.json({
        success: true,
        message: 'Book updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update book',
        error: error.message
      });
    }
  },

  // Delete book (admin only)
  deleteBook: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if book has any active issues
      const [activeIssues] = await db.query(
        'SELECT * FROM issues WHERE book_id = ? AND status = "active"',
        [id]
      );

      if (activeIssues.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete book with active issues'
        });
      }

      await db.query('DELETE FROM books WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Book deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete book',
        error: error.message
      });
    }
  },

  // Search books
  searchBooks: async (req, res) => {
    try {
      const { query } = req.query;
      const searchQuery = `%${query}%`;

      const [books] = await db.query(
        'SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR isbn LIKE ? OR category LIKE ?',
        [searchQuery, searchQuery, searchQuery, searchQuery]
      );

      res.json({
        success: true,
        books
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Search failed',
        error: error.message
      });
    }
  }
};

module.exports = bookController;