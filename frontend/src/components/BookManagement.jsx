import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Table, Button, Badge, Form, Modal, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./BookManagement.css";

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    quantity: 1,
    description: '',
    publication_date: '',
    publisher: '',
    language: '',
    price: '',
    active: true,
    cover_image: null
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : 
              type === 'file' ? files[0] : 
              type === 'number' ? parseInt(value) || '' : 
              value
    }));
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/books', {
        withCredentials: true
      });
      console.log('Fetched books:', response.data);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error.response || error);
      alert('Error fetching books. Please check the console for details.');
    }
  };

  const [statistics, setStatistics] = useState({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    categories: {}
  });
  
  useEffect(() => {
    if (books.length > 0) {
      const stats = {
        totalBooks: books.length,
        availableBooks: books.filter(book => book.active).length,
        borrowedBooks: books.filter(book => !book.active).length,
        categories: books.reduce((acc, book) => {
          acc[book.category] = (acc[book.category] || 0) + 1;
          return acc;
        }, {})
      };
      setStatistics(stats);
    }
  }, [books]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleEditBook = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      quantity: book.quantity,
      description: book.description,
      publication_date: book.publication_date,
      publisher: book.publisher,
      language: book.language,
      price: book.price,
      active: book.active,
      cover_image: null
    });
    setShowModal(true);
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/books/${bookId}`, {
          withCredentials: true
        });
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Error deleting book. Please try again.');
      }
    }
  };

  const handleAddBook = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      isbn: '',
      category: '',
      quantity: 1,
      description: '',
      publication_date: '',
      publisher: '',
      language: '',
      price: '',
      active: true,
      cover_image: null
    });
    setShowModal(true);
  };
  
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.author.trim()) errors.author = 'Author is required';
    if (!formData.isbn.trim()) {
      errors.isbn = 'ISBN is required';
    } else if (!/^(?:\d{3}-)?\d{10}$|^(?:\d{3}-)?\d{13}$/.test(formData.isbn)) {
      errors.isbn = 'Invalid ISBN format (use 10 or 13 digits with optional hyphens)';
    }
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.quantity || formData.quantity < 1) errors.quantity = 'Quantity must be at least 1';
    if (!formData.price || formData.price < 0) errors.price = 'Price must be positive';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = editingBook 
        ? await axios.put(
            `http://localhost:5000/api/admin/books/${editingBook.id}`, 
            formDataToSend,
            { 
              headers: { 'Content-Type': 'multipart/form-data' },
              withCredentials: true
            }
          )
        : await axios.post(
            'http://localhost:5000/api/admin/books', 
            formDataToSend,
            { 
              headers: { 'Content-Type': 'multipart/form-data' },
              withCredentials: true
            }
          );

      toast.success(editingBook ? 'Book updated successfully!' : 'Book added successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setShowModal(false);
      await fetchBooks();
    } catch (error) {
      console.error('Error saving book:', error);
      const errorData = error.response?.data;

      if (errorData?.field) {
        setFormErrors({
          [errorData.field]: errorData.message || 
            (errorData.field === 'isbn' ? 'ISBN already exists' : 
             errorData.field === 'title' ? 'Title already exists' :
             errorData.field === 'quantity' ? 'Must be positive number' :
             errorData.field === 'cover_image' ? errorData.message :
             errorData.field === 'category' ? 'Invalid category' :
             'Invalid value')
        });
      } else {
        toast.error(errorData?.message || 'Error saving book. Please try again.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    return a[sortField] > b[sortField] ? direction : -direction;
  });

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <>
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stat-icon">
                  <i className="fas fa-books"></i>
                </div>
                <div>
                  <h6 className="mb-0">Total Books</h6>
                  <h3 className="mb-0">{statistics.totalBooks}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stat-icon bg-success-light">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div>
                  <h6 className="mb-0">Available Books</h6>
                  <h3 className="mb-0">{statistics.availableBooks}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stat-icon bg-warning-light">
                  <i className="fas fa-clock"></i>
                </div>
                <div>
                  <h6 className="mb-0">Borrowed Books</h6>
                  <h3 className="mb-0">{statistics.borrowedBooks}</h3>
                </div>
              </div>         
             </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stat-icon bg-info-light">
                  <i className="fas fa-tags"></i>
                </div>
                <div>
                  <h6 className="mb-0">Categories</h6>
                  <h3 className="mb-0">{Object.keys(statistics.categories).length}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
  
      <Row className="mb-4">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search books by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>
  
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5>Book Management</h5>
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={handleAddBook}>
                <i className="fas fa-plus"></i> Add Book
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th onClick={() => handleSort('title')}>Title</th>
                <th onClick={() => handleSort('author')}>Author</th>
                <th onClick={() => handleSort('category')}>Category</th>
                <th onClick={() => handleSort('isbn')}>ISBN</th>
                <th onClick={() => handleSort('publisher')}>Publisher</th>
                <th onClick={() => handleSort('quantity')}>Quantity</th>
                <th onClick={() => handleSort('price')}>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedBooks.length > 0 ? (
                sortedBooks.map((book) => (
                  <tr key={book.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {book.cover_image && (
                          <img 
                            src={`http://localhost:5000${book.cover_image}`}
                            alt={book.title} 
                            style={{ width: '40px', height: '60px', objectFit: 'cover', marginRight: '10px' }} 
                          />
                        )}
                        {book.title}
                      </div>
                    </td>
                    <td>{book.author}</td>
                    <td>{book.category}</td>
                    <td>{book.isbn}</td>
                    <td>{book.publisher}</td>
                    <td>{book.quantity}</td>
                    <td>${book.price}</td>
                    <td>
                      <Badge bg={book.active ? 'success' : 'danger'}>
                        {book.active ? 'Available' : 'Unavailable'}
                      </Badge>
                    </td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditBook(book)}>
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteBook(book.id)}>
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">No books found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        size="lg"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{editingBook ? 'Edit Book' : 'Add New Book'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="e.g., The Great Gatsby"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Author</Form.Label>
                  <Form.Control
                    type="text"
                    name="author"
                    placeholder="e.g., F. Scott Fitzgerald"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>ISBN</Form.Label>
                  <Form.Control
                    type="text"
                    name="isbn"
                    placeholder="e.g., 978-0-7475-3269-9"
                    value={formData.isbn}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    isInvalid={!!formErrors.category}
                  >
                    {formErrors.category && (
                      <Form.Control.Feedback type="invalid">
                        {formErrors.category}
                      </Form.Control.Feedback>
                    )}
                    <option value="">Select Category</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Science">Science</option>
                    <option value="Technology">Technology</option>
                    <option value="History">History</option>
                    <option value="Literature">Literature</option>
                    <option value="Finance">Finance</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Publisher</Form.Label>
                  <Form.Control
                    type="text"
                    name="publisher"
                    placeholder="e.g., Penguin Books"
                    value={formData.publisher}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Publication Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="publication_date"
                    value={formData.publication_date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Language</Form.Label>
                  <Form.Control
                    type="text"
                    name="language"
                    placeholder="e.g., English"
                    value={formData.language}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    placeholder="e.g., 29.99"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    isInvalid={!!formErrors.price}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.price}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    min="1"
                    placeholder="e.g., 5"
                    value={formData.quantity}
                    onChange={handleChange}
                    isInvalid={!!formErrors.quantity}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.quantity}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cover Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="cover_image"
                    accept="image/*"
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={3}
                placeholder="Enter book description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                name="active"
                id="active-switch"
                label="Book is available"
                checked={formData.active}
                onChange={handleChange}
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={!formData.title || !formData.author || !formData.isbn}
              >
                {editingBook ? 'Save Changes' : 'Add Book'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BookManagement;
