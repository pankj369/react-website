const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  
  if (!token) return res.status(403).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};
