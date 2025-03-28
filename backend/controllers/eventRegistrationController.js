const db = require('../config/db'); // Assuming you have a db.js file for database connection

// Controller function to handle event registration
const registerForEvent = async (req, res) => {
  const { event_id, name, email, phone } = req.body; 

  // Validate input
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
  const phoneRegex = /^\d{10}$/; // Assuming a 10-digit phone number

  if (!event_id || !name || !email || !phone) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: 'Invalid phone number format. Must be 10 digits.' });
  }

  try {
    // Insert registration data into the database
    const query = 'INSERT INTO registrations (event_id, name, email, phone) VALUES (?, ?, ?, ?)';
    await db.query(query, [event_id, name, email, phone]);

    return res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error('Error registering for event:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { registerForEvent };
