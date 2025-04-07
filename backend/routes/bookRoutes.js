const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: './public/uploads/books',
  filename: (req, file, cb) => {
    cb(null, `book-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb('Error: Images Only!');
  }
}).single('cover_image');

router.get('/books', bookController.getAllBooks);
router.post('/books', upload, bookController.addBook);
router.put('/books/:id', upload, bookController.updateBook);
router.delete('/books/:id', bookController.deleteBook);

module.exports = router;