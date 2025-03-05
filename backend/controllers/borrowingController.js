const BorrowingService = require('../services/borrowingService');
const BookService = require('../services/bookService');

exports.borrowBook = async (req, res) => {
  try {
    const { bookId, dueDate } = req.body;
    const userId = req.user.id;

    // Check book availability first
    const available = await BookService.checkAvailability(bookId);
    if (available <= 0) {
      return res.status(400).json({ message: 'Book is not available' });
    }

    const borrowingId = await BorrowingService.borrowBook(userId, bookId, dueDate);
    const borrowing = await BorrowingService.getBorrowingById(borrowingId);

    res.status(201).json({ success: true, data: borrowing });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { borrowId } = req.params;
    await BorrowingService.returnBook(borrowId);
    res.json({ success: true, message: 'Book returned successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserBorrowings = async (req, res) => {
  try {
    const borrowings = await BorrowingService.getUserBorrowings(req.user.id);
    res.json({ success: true, data: borrowings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};