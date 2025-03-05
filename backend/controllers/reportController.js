const db = require("../config/db");

const reportController = {
  // Get library statistics
  getLibraryStats: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Access denied. Admin only."
        });
      }

      const [bookStats] = await db.query(`
        SELECT 
          COUNT(*) as total_books,
          SUM(quantity) as total_copies,
          SUM(available_quantity) as available_copies,
          COUNT(DISTINCT category) as total_categories
        FROM books
      `);

      const [issueStats] = await db.query(`
        SELECT 
          COUNT(*) as total_issues,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_issues,
          COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_issues,
          SUM(fine) as total_fines
        FROM issues
      `);

      const [userStats] = await db.query(`
        SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN role = 'student' THEN 1 END) as total_students,
          COUNT(DISTINCT batch) as total_batches
        FROM users
      `);

      res.json({
        success: true,
        data: {
          bookStats: bookStats[0],
          issueStats: issueStats[0],
          userStats: userStats[0]
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error generating library statistics",
        error: error.message
      });
    }
  },

  // Get monthly report
  getMonthlyReport: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Access denied. Admin only."
        });
      }

      const { month, year } = req.query;
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-31`;

      const [monthlyStats] = await db.query(`
        SELECT 
          COUNT(*) as total_issues,
          COUNT(CASE WHEN status = 'returned' THEN 1 END) as returns,
          SUM(fine) as fines_collected,
          COUNT(DISTINCT user_id) as active_users
        FROM issues
        WHERE issue_date BETWEEN ? AND ?
      `, [startDate, endDate]);

      const [popularBooks] = await db.query(`
        SELECT b.title, b.author, COUNT(i.id) as issue_count
        FROM books b
        JOIN issues i ON b.id = i.book_id
        WHERE i.issue_date BETWEEN ? AND ?
        GROUP BY b.id
        ORDER BY issue_count DESC
        LIMIT 5
      `, [startDate, endDate]);

      res.json({
        success: true,
        data: {
          monthlyStats: monthlyStats[0],
          popularBooks
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error generating monthly report",
        error: error.message
      });
    }
  },

  // Get fine collection report
  getFineReport: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Access denied. Admin only."
        });
      }

      const [fineDetails] = await db.query(`
        SELECT 
          u.name as student_name,
          u.batch,
          b.title as book_title,
          i.issue_date,
          i.due_date,
          i.return_date,
          i.fine
        FROM issues i
        JOIN users u ON i.user_id = u.id
        JOIN books b ON i.book_id = b.id
        WHERE i.fine > 0
        ORDER BY i.fine DESC
      `);

      const [totalFines] = await db.query(`
        SELECT 
          SUM(fine) as total_fines,
          COUNT(DISTINCT user_id) as students_with_fines
        FROM issues
        WHERE fine > 0
      `);

      res.json({
        success: true,
        data: {
          fineDetails,
          summary: totalFines[0]
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error generating fine report",
        error: error.message
      });
    }
  }
};

module.exports = reportController;