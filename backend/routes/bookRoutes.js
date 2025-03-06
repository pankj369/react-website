const router = require('express').Router();
const bookController = require('../controllers/bookController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Book routes
router.get('/books', auth, bookController.getAllBooks);
router.get('/books/:id', auth, bookController.getBookById);
router.post('/books', auth, adminAuth, bookController.createBook);
router.put('/books/:id', auth, adminAuth, bookController.updateBook);
router.delete('/books/:id', auth, adminAuth, bookController.deleteBook);
router.get('/books/search/:query', auth, bookController.searchBooks);

module.exports = router;