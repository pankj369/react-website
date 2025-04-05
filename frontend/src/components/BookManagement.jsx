import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Table, Button, Badge, Form, Modal, Row, Col, } from 'react-bootstrap';
import "./BookManagement.css";

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  
  // Define formData state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    quantity: '',
    category: '',
    description: '',
    active: true,
    cover_image: null
  });

  const handleViewBook = (book) => {
    setSelectedBook(book);
    setShowViewModal(true);
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching book data:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      isbn: '',
      quantity: '',
      active: true,
      cover_image: null
    });
    setShowModal(true);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      quantity: book.quantity,
      active: book.active,
      cover_image: null
    });
    setShowModal(true);
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/books/${bookId}`);
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      if (editingBook) {
        await axios.put(
          `http://localhost:5000/api/admin/books/${editingBook.id}`, 
          formDataToSend,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/admin/books', 
          formDataToSend,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      }
      setShowModal(false);
      fetchBooks();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const shortBooks = filteredBooks.slice(0, 10); // Example: Limit to the first 10 books

  const sortedBooks = [...shortBooks].sort((a, b) => {
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
                <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                  Title {sortField === 'title' && <i className={`fas fa-sort-${sortDirection}`}></i>}
                </th>
                <th onClick={() => handleSort('author')} style={{ cursor: 'pointer' }}>
                  Author {sortField === 'author' && <i className={`fas fa-sort-${sortDirection}`}></i>}
                </th>
                <th onClick={() => handleSort('isbn')} style={{ cursor: 'pointer' }}>
                  ISBN {sortField === 'isbn' && <i className={`fas fa-sort-${sortDirection}`}></i>}
                </th>
                <th onClick={() => handleSort('quantity')} style={{ cursor: 'pointer' }}>
                  Quantity {sortField === 'quantity' && <i className={`fas fa-sort-${sortDirection}`}></i>}
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedBooks.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.isbn}</td>
                  <td>{book.quantity}</td>
                  <td>
                    <Badge bg={book.active ? 'success' : 'danger'}>
                      {book.active ? 'Available' : 'Unavailable'}
                    </Badge>
                  </td>
                  <td className="d-flex gap-2"></td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditBook(book)}>
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteBook(book.id)}>
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
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
                    placeholder="Enter book title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Author</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter author name"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
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
                    placeholder="Enter ISBN"
                    value={formData.isbn}
                    onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    placeholder="Enter quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Cover Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, cover_image: e.target.files[0]})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="active-switch"
                label="Book is available"
                checked={formData.active}
                onChange={(e) => setFormData({...formData, active: e.target.checked})}
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingBook ? 'Update Book' : 'Add Book'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BookManagement;