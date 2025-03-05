const User = require('../models/User');
const Book = require('../models/Book');

const db = require('../config/database');

const BookService = require('../services/bookService');
const UserService = require('../services/userService');

exports.getAllStudents = async (req, res) => {
  try {
    const students = await UserService.findByRole('student');
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await BookService.findAll();
    res.json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addBook = async (req, res) => {
  try {
    const bookId = await BookService.create(req.body);
    const book = await BookService.findById(bookId);
    res.status(201).json({ success: true, data: book });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const updated = await BookService.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Book not found' });
    }
    const book = await BookService.findById(req.params.id);
    res.json({ success: true, data: book });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const deleted = await BookService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const [notifications] = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};