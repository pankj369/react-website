const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/dashboardRoutes"));

// Default Route
app.get("/", (req, res) => {
  res.send("Library Management System Backend is Running!");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
