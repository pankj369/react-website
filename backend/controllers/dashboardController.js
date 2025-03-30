const db = require("../config/db");

const dashboardController = {
  // Get student dashboard data
  getStudentDashboard: async (req, res) => {
    // Existing code...
  },

  // New function to get all students
  getAllStudents: async (req, res) => {
    try {
      const [students] = await db.query("SELECT id, fullname, email, contact, batch, password, role, status, created_at FROM users WHERE role = 'student'");

      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching students",
        error: error.message
      });
    }
  }
};

module.exports = dashboardController;
