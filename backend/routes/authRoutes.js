const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", verifyToken, authController.getCurrentUser);
router.post('/reset-password', authController.requestPasswordReset);

module.exports = router;