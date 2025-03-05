const db = require("../config/db");

const dashboardController = {
  // Get student dashboard data
  getStudentDashboard: async (req, res) => {
    try {
      const userId = req.user.id;

      // Get student's basic info
      const [userInfo] = await db.query(
        "SELECT fullname, email, contact, batch FROM users WHERE id = ?",
        [userId]
      );

      // Get attendance stats
      const [attendanceStats] = await db.query(`
        SELECT 
          COUNT(*) as total_visits,
          SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(check_out, check_in)))) as total_hours
        FROM attendance 
        WHERE user_id = ? AND check_out IS NOT NULL`,
        [userId]
      );

      // Get enrolled courses
      const [courses] = await db.query(`
        SELECT c.name, c.duration, sc.start_date, sc.status
        FROM student_courses sc
        JOIN courses c ON sc.course_id = c.id
        WHERE sc.user_id = ?`,
        [userId]
      );

      // Get recent activities
      const [recentActivities] = await db.query(`
        SELECT 
          'attendance' as type,
          DATE_FORMAT(check_in, '%Y-%m-%d %H:%i') as timestamp,
          'Library Visit' as description
        FROM attendance
        WHERE user_id = ?
        ORDER BY check_in DESC
        LIMIT 5`,
        [userId]
      );

      res.json({
        success: true,
        data: {
          userInfo: userInfo[0],
          attendanceStats: attendanceStats[0],
          courses,
          recentActivities
        }
      });
    } catch (error) {
      console.error("Dashboard Error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching dashboard data",
        error: error.message
      });
    }
  }
};

module.exports = dashboardController;