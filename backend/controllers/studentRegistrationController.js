const db = require('../config/db'); // Assuming you have a db.js file for database connection

// Controller function to handle student registration
const registerStudent = async (req, res) => {
  const { fullname, email, contact } = req.body; 

  // Validate input
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
  const contactRegex = /^\d{10}$/; // Assuming a 10-digit contact number

  if (!fullname || !email || !contact) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  if (!contactRegex.test(contact)) {
    return res.status(400).json({ message: 'Invalid contact number format. Must be 10 digits.' });
  }

  try {
    // Insert student data into the database
    const query = 'INSERT INTO users (fullname, email, contact, role) VALUES (?, ?, ?, ?)';
    await db.query(query, [fullname, email, contact, 'student']);

    return res.status(201).json({ message: 'Student registration successful!' });
  } catch (error) {
    console.error('Error registering student:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { registerStudent };
