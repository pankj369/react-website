const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { getDashboard } = require("../controllers/dashboardController");

const router = express.Router();

// Dashboard Route (Admin & Student)
router.get("/dashboard", verifyToken, getDashboard);

module.exports = router;
