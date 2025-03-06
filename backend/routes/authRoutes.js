const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require('../middleware/auth');

// Auth routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get('/verify', auth, authController.verifyToken);
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);
router.get('/logout', authController.logout);

module.exports = router;