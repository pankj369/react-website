const db = require("../config/db");

const searchController = {
  // Search books with filters
  searchBooks: async (req, res) => {
    try {
      const { query, category, author, availability } = req.query;
      let sqlQuery = `
        SELECT b.*, 
          (b.quantity - b.available_quantity) as borrowed_count,
          COALESCE(AVG(r.rating), 0) as average_rating,
          COUNT(DISTINCT r.id) as review_count
        FROM books b
        LEFT JOIN reviews r ON b.id = r.book_id
        WHERE 1=1
      `;
      const params = [];

      if (query) {
        sqlQuery += ` AND (b.title LIKE ? OR b.isbn LIKE ?)`;
        params.push(`%${query}%`, `%${query}%`);
      }

      if (category) {
        sqlQuery += ` AND b.category = ?`;
        params.push(category);
      }

      if (author) {
        sqlQuery += ` AND b.author LIKE ?`;
        params.push(`%${author}%`);
      }

      if (availability === 'available') {
        sqlQuery += ` AND b.available_quantity > 0`;
      }

      sqlQuery += ` GROUP BY b.id ORDER BY b.title`;

      const [books] = await db.query(sqlQuery, params);

      res.json({
        success: true,
        data: books
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error searching books",
        error: error.message
      });
    }
  },

  // Get book categories
  getCategories: async (req, res) => {
    try {
      const [categories] = await db.query(
        `SELECT DISTINCT category FROM books ORDER BY category`
      );

      res.json({
        success: true,
        data: categories.map(c => c.category)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching categories",
        error: error.message
      });
    }
  },

  // Get popular books
  getPopularBooks: async (req, res) => {
    try {
      const [books] = await db.query(`
        SELECT b.*, 
          COUNT(i.id) as borrow_count,
          COALESCE(AVG(r.rating), 0) as average_rating
        FROM books b
        LEFT JOIN issues i ON b.id = i.book_id
        LEFT JOIN reviews r ON b.id = r.book_id
        GROUP BY b.id
        ORDER BY borrow_count DESC, average_rating DESC
        LIMIT 10
      `);

      res.json({
        success: true,
        data: books
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching popular books",
        error: error.message
      });
    }
  },

  // Get new arrivals
  getNewArrivals: async (req, res) => {
    try {
      const [books] = await db.query(`
        SELECT * FROM books
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        ORDER BY created_at DESC
        LIMIT 10
      `);

      res.json({
        success: true,
        data: books
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching new arrivals",
        error: error.message
      });
    }
  }
};

module.exports = searchController;