const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "your_password",
  database: process.env.DB_NAME || "library_management",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed: " + err.message);
    return;
  }
  console.log("✅ Connected to MySQL Database");
});

module.exports = db;
