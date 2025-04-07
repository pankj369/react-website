const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: './public/uploads/books',
    filename: function(req, file, cb) {
        cb(null, 'book-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('cover_image');

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

const bookController = {
    getAllBooks: async (req, res) => {
        try {
            const [books] = await db.query('SELECT * FROM books ORDER BY created_at DESC');
            res.json(books);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching books', error: error.message });
        }
    },

    addBook: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: err });
            }

            try {
                const { title, author, isbn, quantity, active, category, publisher, description, language, price } = req.body;
                const cover_image = req.file ? `/uploads/books/${req.file.filename}` : null;
                const location = 'Default Location'; // Set default location

                // Ensure quantity is a number and at least 1
                const parsedQuantity = Math.max(1, parseInt(quantity) || 1);
                
                const [result] = await db.query(
                    `INSERT INTO books 
                    (title, author, isbn, category, quantity, available_quantity, cover_image, active, publisher, description, language, price, location) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        title, 
                        author, 
                        isbn, 
                        category || 'General', 
                        parsedQuantity, 
                        parsedQuantity,  // Set available_quantity same as quantity
                        cover_image, 
                        active !== false, 
                        publisher || '',
                        description || '',
                        language || 'English',
                        price || 0,
                        location
                    ]
                );

                res.status(201).json({
                    message: 'Book added successfully',
                    bookId: result.insertId
                });
            } catch (error) {
                res.status(500).json({ message: 'Error adding book', error: error.message });
            }
        });
    },

    updateBook: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: err });
            }

            try {
                const { id } = req.params;
                const { title, author, isbn, quantity, active } = req.body;
                const cover_image = req.file ? `/uploads/books/${req.file.filename}` : null;

                let query = `UPDATE books SET title = ?, author = ?, isbn = ?, quantity = ?, active = ?`;
                let params = [title, author, isbn, quantity, active];

                if (cover_image) {
                    query += `, cover_image = ?`;
                    params.push(cover_image);
                }

                query += ` WHERE id = ?`;
                params.push(id);

                const [result] = await db.query(query, params);

                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Book not found' });
                }

                res.json({ message: 'Book updated successfully' });
            } catch (error) {
                res.status(500).json({ message: 'Error updating book', error: error.message });
            }
        });
    },

    deleteBook: async (req, res) => {
        try {
            const { id } = req.params;
            const [result] = await db.query('DELETE FROM books WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Book not found' });
            }

            res.json({ message: 'Book deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting book', error: error.message });
        }
    }
};

module.exports = bookController;