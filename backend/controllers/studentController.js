const Student = require('../models/Student');

const studentController = {
    getAllStudents: async (req, res) => {
        try {
            const students = await Student.getAll();
            res.json(students);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getStudentById: async (req, res) => {
        try {
            const student = await Student.getById(req.params.id);
            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }
            res.json(student);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createStudent: async (req, res) => {
        try {
            const student = await Student.create(req.body);
            res.status(201).json(student);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    updateStudent: async (req, res) => {
        try {
            const success = await Student.update(req.params.id, req.body);
            if (!success) {
                return res.status(404).json({ message: 'Student not found' });
            }
            res.json({ message: 'Student updated successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    deleteStudent: async (req, res) => {
        try {
            const success = await Student.delete(req.params.id);
            if (!success) {
                return res.status(404).json({ message: 'Student not found' });
            }
            res.json({ message: 'Student deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    searchStudents: async (req, res) => {
        try {
            const students = await Student.search(req.params.query);
            res.json(students);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = studentController;