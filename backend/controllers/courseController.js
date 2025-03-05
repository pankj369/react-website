const db = require("../config/db");

const courseController = {
  // Enroll student in a course
  enrollCourse: async (req, res) => {
    try {
      const { courseId } = req.body;
      const userId = req.user.id;

      // Check if already enrolled
      const [existingEnrollment] = await db.query(
        "SELECT * FROM student_courses WHERE user_id = ? AND course_id = ? AND status = 'active'",
        [userId, courseId]
      );

      if (existingEnrollment.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Already enrolled in this course"
        });
      }

      // Get course details
      const [course] = await db.query(
        "SELECT * FROM courses WHERE id = ?",
        [courseId]
      );

      if (course.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Course not found"
        });
      }

      // Calculate end date based on course duration
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + parseInt(course[0].duration));

      // Create enrollment and payment record
      await db.query("START TRANSACTION");

      await db.query(
        "INSERT INTO student_courses (user_id, course_id, start_date, end_date) VALUES (?, ?, ?, ?)",
        [userId, courseId, startDate, endDate]
      );

      await db.query(
        "INSERT INTO payments (user_id, amount, payment_type, status) VALUES (?, ?, 'course_fee', 'pending')",
        [userId, course[0].fee]
      );

      await db.query("COMMIT");

      res.json({
        success: true,
        message: "Course enrollment successful"
      });
    } catch (error) {
      await db.query("ROLLBACK");
      res.status(500).json({
        success: false,
        message: "Error during enrollment",
        error: error.message
      });
    }
  },

  // Get student's courses
  getMyCourses: async (req, res) => {
    try {
      const userId = req.user.id;

      const [courses] = await db.query(`
        SELECT c.*, sc.start_date, sc.end_date, sc.status,
        p.status as payment_status
        FROM student_courses sc
        JOIN courses c ON sc.course_id = c.id
        LEFT JOIN payments p ON sc.user_id = p.user_id 
        AND p.payment_type = 'course_fee'
        WHERE sc.user_id = ?
        ORDER BY sc.start_date DESC
      `, [userId]);

      res.json({
        success: true,
        data: courses
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching courses",
        error: error.message
      });
    }
  }
};

module.exports = courseController;