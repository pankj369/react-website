const db = require("../config/db");

const notificationController = {
  // Get user notifications
  getNotifications: async (req, res) => {
    try {
      const userId = req.user.id;
      const [notifications] = await db.query(
        `SELECT * FROM notifications 
         WHERE user_id = ? 
         ORDER BY created_at DESC 
         LIMIT 10`,
        [userId]
      );

      res.json({
        success: true,
        data: notifications
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching notifications",
        error: error.message
      });
    }
  },

  // Mark notification as read
  markAsRead: async (req, res) => {
    try {
      const { notificationId } = req.params;
      const userId = req.user.id;

      await db.query(
        `UPDATE notifications 
         SET is_read = true 
         WHERE id = ? AND user_id = ?`,
        [notificationId, userId]
      );

      res.json({
        success: true,
        message: "Notification marked as read"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating notification",
        error: error.message
      });
    }
  },

  // Create notification (admin only)
  createNotification: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Access denied"
        });
      }

      const { userId, message, type } = req.body;

      await db.query(
        `INSERT INTO notifications (user_id, message, type) 
         VALUES (?, ?, ?)`,
        [userId, message, type]
      );

      res.json({
        success: true,
        message: "Notification created successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating notification",
        error: error.message
      });
    }
  },

  // Send due date reminder notifications
  sendDueReminders: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Access denied"
        });
      }

      // Get books due in next 2 days
      const [upcomingDue] = await db.query(`
        SELECT i.*, u.id as user_id, b.title, u.name as student_name
        FROM issues i
        JOIN users u ON i.user_id = u.id
        JOIN books b ON i.book_id = b.id
        WHERE i.status = 'active' 
        AND i.due_date BETWEEN NOW() 
        AND DATE_ADD(NOW(), INTERVAL 2 DAY)
      `);

      // Create notifications for each
      for (const issue of upcomingDue) {
        await db.query(
          `INSERT INTO notifications (user_id, message, type) 
           VALUES (?, ?, 'due_reminder')`,
          [
            issue.user_id,
            `Your book "${issue.title}" is due on ${new Date(issue.due_date).toLocaleDateString()}`
          ]
        );
      }

      res.json({
        success: true,
        message: "Due date reminders sent",
        count: upcomingDue.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error sending reminders",
        error: error.message
      });
    }
  },

  // Get unread notifications count
  getUnreadCount: async (req, res) => {
    try {
      const userId = req.user.id;
      const [result] = await db.query(
        `SELECT COUNT(*) as count 
         FROM notifications 
         WHERE user_id = ? AND is_read = false`,
        [userId]
      );

      res.json({
        success: true,
        count: result[0].count
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching unread count",
        error: error.message
      });
    }
  }
};

module.exports = notificationController;