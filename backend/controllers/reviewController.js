const db = require("../config/db");

const reviewController = {
  // Add a review
  addReview: async (req, res) => {
    try {
      const { bookId, rating, comment } = req.body;
      const userId = req.user.id;

      // Check if user has borrowed this book
      const [hasIssued] = await db.query(
        `SELECT * FROM issues 
         WHERE user_id = ? AND book_id = ? AND status = 'returned'`,
        [userId, bookId]
      );

      if (hasIssued.length === 0) {
        return res.status(400).json({
          success: false,
          message: "You can only review books you have borrowed and returned"
        });
      }

      // Check if user already reviewed this book
      const [existingReview] = await db.query(
        `SELECT * FROM reviews 
         WHERE user_id = ? AND book_id = ?`,
        [userId, bookId]
      );

      if (existingReview.length > 0) {
        return res.status(400).json({
          success: false,
          message: "You have already reviewed this book"
        });
      }

      await db.query(
        `INSERT INTO reviews (user_id, book_id, rating, comment) 
         VALUES (?, ?, ?, ?)`,
        [userId, bookId, rating, comment]
      );

      res.json({
        success: true,
        message: "Review added successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error adding review",
        error: error.message
      });
    }
  },

  // Get reviews for a book
  getBookReviews: async (req, res) => {
    try {
      const { bookId } = req.params;

      const [reviews] = await db.query(`
        SELECT r.*, u.name as user_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.book_id = ?
        ORDER BY r.created_at DESC
      `, [bookId]);

      const [stats] = await db.query(`
        SELECT 
          COUNT(*) as total_reviews,
          AVG(rating) as average_rating,
          COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
          COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
          COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
          COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
          COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
        FROM reviews
        WHERE book_id = ?
      `, [bookId]);

      res.json({
        success: true,
        data: {
          reviews,
          stats: stats[0]
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching reviews",
        error: error.message
      });
    }
  },

  // Update review
  updateReview: async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user.id;

      const [review] = await db.query(
        `SELECT * FROM reviews WHERE id = ? AND user_id = ?`,
        [reviewId, userId]
      );

      if (review.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Review not found or unauthorized"
        });
      }

      await db.query(
        `UPDATE reviews SET rating = ?, comment = ? WHERE id = ?`,
        [rating, comment, reviewId]
      );

      res.json({
        success: true,
        message: "Review updated successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating review",
        error: error.message
      });
    }
  },

  // Delete review
  deleteReview: async (req, res) => {
    try {
      const { reviewId } = req.params;
      const userId = req.user.id;

      const [review] = await db.query(
        `SELECT * FROM reviews WHERE id = ? AND user_id = ?`,
        [reviewId, userId]
      );

      if (review.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Review not found or unauthorized"
        });
      }

      await db.query(
        `DELETE FROM reviews WHERE id = ?`,
        [reviewId]
      );

      res.json({
        success: true,
        message: "Review deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting review",
        error: error.message
      });
    }
  }
};

module.exports = reviewController;