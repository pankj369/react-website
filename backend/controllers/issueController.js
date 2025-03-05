const db = require("../config/db");

const issueController = {
  // Issue a book to student
  issueBook: async (req, res) => {
    try {
      const { bookId } = req.body;
      const userId = req.user.id;

      // Check if book exists and is available
      const [book] = await db.query(
        "SELECT * FROM books WHERE id = ? AND available_quantity > 0",
        [bookId]
      );

      if (book.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Book not available"
        });
      }

      // Check if student already has 3 active books
      const [activeIssues] = await db.query(
        "SELECT COUNT(*) as count FROM issues WHERE user_id = ? AND status = 'active'",
        [userId]
      );

      if (activeIssues[0].count >= 3) {
        return res.status(400).json({
          success: false,
          message: "Maximum book limit reached (3 books)"
        });
      }

      // Calculate due date (14 days from now)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      // Create issue record
      await db.query(
        "INSERT INTO issues (user_id, book_id, due_date) VALUES (?, ?, ?)",
        [userId, bookId, dueDate]
      );

      // Update book available quantity
      await db.query(
        "UPDATE books SET available_quantity = available_quantity - 1 WHERE id = ?",
        [bookId]
      );

      res.json({
        success: true,
        message: "Book issued successfully",
        dueDate
      });

    } catch (error) {
      console.error("Issue Error:", error);
      res.status(500).json({
        success: false,
        message: "Error issuing book",
        error: error.message
      });
    }
  },

  // Return a book
  returnBook: async (req, res) => {
    try {
      const { issueId } = req.body;

      // Get issue details
      const [issue] = await db.query(
        "SELECT * FROM issues WHERE id = ? AND status = 'active'",
        [issueId]
      );

      if (issue.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Issue record not found"
        });
      }

      // Calculate fine if overdue (₹10 per day)
      let fine = 0;
      const dueDate = new Date(issue[0].due_date);
      const today = new Date();
      
      if (today > dueDate) {
        const daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
        fine = daysOverdue * 10;
      }

      // Update issue record
      await db.query(
        "UPDATE issues SET status = 'returned', return_date = NOW(), fine = ? WHERE id = ?",
        [fine, issueId]
      );

      // Update book available quantity
      await db.query(
        "UPDATE books SET available_quantity = available_quantity + 1 WHERE id = ?",
        [issue[0].book_id]
      );

      res.json({
        success: true,
        message: "Book returned successfully",
        fine
      });

    } catch (error) {
      console.error("Return Error:", error);
      res.status(500).json({
        success: false,
        message: "Error returning book",
        error: error.message
      });
    }
  },

  // Get all issues (admin only)
  getAllIssues: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Access denied"
        });
      }

      const [issues] = await db.query(`
        SELECT i.*, 
          u.name as student_name, 
          b.title as book_title,
          b.author as book_author
        FROM issues i
        JOIN users u ON i.user_id = u.id
        JOIN books b ON i.book_id = b.id
        ORDER BY i.issue_date DESC
      `);

      res.json({
        success: true,
        data: issues
      });

    } catch (error) {
      console.error("Fetch Issues Error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching issues",
        error: error.message
      });
    }
  },

  // Get overdue issues (admin only)
  getOverdueIssues: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Access denied"
        });
      }

      const [overdueIssues] = await db.query(`
        SELECT i.*, 
          u.name as student_name, 
          u.email as student_email,
          u.contact as student_contact,
          b.title as book_title
        FROM issues i
        JOIN users u ON i.user_id = u.id
        JOIN books b ON i.book_id = b.id
        WHERE i.status = 'active' AND i.due_date < NOW()
        ORDER BY i.due_date ASC
      `);

      res.json({
        success: true,
        data: overdueIssues
      });

    } catch (error) {
      console.error("Fetch Overdue Error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching overdue issues",
        error: error.message
      });
    }
  }
};

module.exports = issueController;