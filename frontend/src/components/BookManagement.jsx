import React, { useState } from 'react';
import { Card, Table, Button, Badge, Form, InputGroup, Modal } from 'react-bootstrap';

const BookManagement = ({ books, onAddBook, onUpdateBook, onDeleteBook }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    quantity: '',
    category: ''
  });

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedBook) {
      onUpdateBook(selectedBook.id, bookForm);
      setShowEditModal(false);
    } else {
      onAddBook(bookForm);
      setShowAddModal(false);
    }
    setBookForm({ title: '', author: '', isbn: '', quantity: '', category: '' });
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setBookForm(book);
    setShowEditModal(true);
  };

  const handleDelete = (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      onDeleteBook(bookId);
    }
  };

  const BookFormModal = ({ show, onHide, title }) => (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={bookForm.title}
              onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              value={bookForm.author}
              onChange={(e) => setBookForm({...bookForm, author: e.target.value})}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>ISBN</Form.Label>
            <Form.Control
              type="text"
              value={bookForm.isbn}
              onChange={(e) => setBookForm({...bookForm, isbn: e.target.value})}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              value={bookForm.quantity}
              onChange={(e) => setBookForm({...bookForm, quantity: e.target.value})}
              required
              min="0"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              value={bookForm.category}
              onChange={(e) => setBookForm({...bookForm, category: e.target.value})}
            />
          </Form.Group>
          <Button type="submit" variant="primary">
            {selectedBook ? 'Update Book' : 'Add Book'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5>Book Management</h5>
          <div className="d-flex gap-2">
            <InputGroup>
              <Form.Control
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline-secondary">
                <i className="fas fa-search"></i>
              </Button>
            </InputGroup>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
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
              <th>ISBN</th>
              <th>Quantity</th>
              <th>Available</th>
              <th>Category</th>
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
                  <Badge bg={book.available > 0 ? 'success' : 'danger'}>
                    {book.available}
                  </Badge>
                </td>
                <td>{book.category}</td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(book)}>
                    <i className="fas fa-edit"></i>
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(book.id)}>
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>

      <BookFormModal 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)} 
        title="Add New Book" 
      />
      <BookFormModal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)} 
        title="Edit Book" 
      />
    </Card>
  );
};

export default BookManagement;