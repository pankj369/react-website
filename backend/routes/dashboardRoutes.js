const express = require("express");
const { getStudentDashboard, getAdminDashboard } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/student/dashboard", getStudentDashboard);
router.get("/admin/dashboard", getAdminDashboard);

module.exports = router;
