const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/db');

// Get all students
router.get('/students', auth, async (req, res) => {
    try {
        const [students] = await db.query(
            'SELECT id, fullname, email, contact, batch, created_at, status FROM users WHERE role = "student" ORDER BY created_at DESC'
        );
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students' });
    }
});

// Update student status
router.put('/students/:id/status', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        await db.query(
            'UPDATE users SET status = ? WHERE id = ? AND role = "student"',
            [status, id]
        );
        
        res.json({ message: 'Student status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating student status' });
    }
});

module.exports = router;