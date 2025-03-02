const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, contact_number, batch, password, confirm_password, role } = req.body;

  // 1️⃣ Validate Input Fields
  if (!name || !email || !contact_number || !batch || !password || !confirm_password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }
  
  if (password !== confirm_password) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // 2️⃣ Check if User Already Exists
    const [existingUser] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3️⃣ Hash the Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Insert User into Database
    await db.promise().query(
      "INSERT INTO users (name, email, contact_number, batch, password, role) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, contact_number, batch, hashedPassword, role]
    );

    // 5️⃣ Generate JWT Token
    const token = jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ message: "User registered successfully", token });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "User registration failed", error: error.message });
  }
});

module.exports = router;
