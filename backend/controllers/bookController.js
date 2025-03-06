const db = require('../config/db');

const Book = require('../models/Book');

const bookController = {
    getAllBooks: async (req, res) => {
        try {
            const books = await Book.getAll();
            res.json(books);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getBookById: async (req, res) => {
        try {
            const book = await Book.getById(req.params.id);
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            res.json(book);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createBook: async (req, res) => {
        try {
            const book = await Book.create(req.body);
            res.status(201).json(book);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    updateBook: async (req, res) => {
        try {
            const success = await Book.update(req.params.id, req.body);
            if (!success) {
                return res.status(404).json({ message: 'Book not found' });
            }
            res.json({ message: 'Book updated successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    deleteBook: async (req, res) => {
        try {
            const success = await Book.delete(req.params.id);
            if (!success) {
                return res.status(404).json({ message: 'Book not found' });
            }
            res.json({ message: 'Book deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    searchBooks: async (req, res) => {
        try {
            const books = await Book.search(req.params.query);
            res.json(books);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = bookController;