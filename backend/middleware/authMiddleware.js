const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Verify JWT Token
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Check if token follows Bearer format
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const token = authHeader.split(" ")[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token has expired" });
    }
    res.status(401).json({ message: "Invalid token" });
  }
};

// Check if user is Admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin only." });
  }
};

// Check if user is Student
const isStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Student only." });
  }
};

// Check if user owns the resource or is admin
const isOwnerOrAdmin = (req, res, next) => {
  if (
    req.user && (
      req.user.role === 'admin' || 
      req.user.id === parseInt(req.params.userId)
    )
  ) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Unauthorized." });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isStudent,
  isOwnerOrAdmin
};