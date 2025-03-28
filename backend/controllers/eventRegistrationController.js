const db = require('../config/db'); // Assuming you have a db.js file for database connection

// Controller function to handle event registration
const registerForEvent = async (req, res) => {
  const { name, email, phone } = req.body; 

  // Validate input
  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Insert registration data into the database
    const query = 'INSERT INTO registrations (name, email, phone) VALUES (?, ?, ?)'; 
    await db.query(query, [name, email, phone]);

    return res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error('Error registering for event:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { registerForEvent };
