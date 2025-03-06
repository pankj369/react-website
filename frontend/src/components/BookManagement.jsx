import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Form, InputGroup, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';
import './BookManagement.css';

const BookManagement = () => {
    const [books, setBooks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('title');
    const [sortDirection, setSortDirection] = useState('asc');
    const [alert, setAlert] = useState(null);
    const [bookForm, setBookForm] = useState({
        title: '',
        author: '',
        isbn: '',
        quantity: '',
        available: '',
        category: '',
        description: ''
    });

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/admin/books', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBooks(response.data);
        } catch (error) {
            showAlert('Error fetching books', 'danger');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (selectedBook) {
                await axios.put(`http://localhost:5000/api/admin/books/${selectedBook.id}`, 
                    bookForm,
                    { headers: { Authorization: `Bearer ${token}` }}
                );
                showAlert('Book updated successfully', 'success');
            } else {
                await axios.post('http://localhost:5000/api/admin/books', 
                    bookForm,
                    { headers: { Authorization: `Bearer ${token}` }}
                );
                showAlert('Book added successfully', 'success');
            }
            setShowModal(false);
            resetForm();
            fetchBooks();
        } catch (error) {
            showAlert(error.response?.data?.message || 'Error saving book', 'danger');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/admin/books/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showAlert('Book deleted successfully', 'success');
                fetchBooks();
            } catch (error) {
                showAlert('Error deleting book', 'danger');
            }
        }
    };

    const handleEdit = (book) => {
        setSelectedBook(book);
        setBookForm(book);
        setShowModal(true);
    };

    const resetForm = () => {
        setSelectedBook(null);
        setBookForm({
            title: '',
            author: '',
            isbn: '',
            quantity: '',
            available: '',
            category: '',
            description: ''
        });
    };

    const showAlert = (message, type) => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 3000);
    };

    const handleSort = (field) => {
        setSortDirection(sortField === field && sortDirection === 'asc' ? 'desc' : 'asc');
        setSortField(field);
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.includes(searchTerm)
    );

    const sortedBooks = [...filteredBooks].sort((a, b) => {
        if (sortDirection === 'asc') {
            return a[sortField] > b[sortField] ? 1 : -1;
        }
        return a[sortField] < b[sortField] ? 1 : -1;
    });

    return (
        <div className="book-management">
            {alert && (
                <Alert variant={alert.type} className="mb-3">
                    {alert.message}
                </Alert>
            )}

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
                            <Button variant="primary" onClick={() => setShowModal(true)}>
                                <i className="fas fa-plus me-1"></i> Add Book
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
            </Card>

            <Modal show={showModal} onHide={() => {
                setShowModal(false);
                resetForm();
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedBook ? 'Edit Book' : 'Add New Book'}</Modal.Title>
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
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={bookForm.description}
                                onChange={(e) => setBookForm({...bookForm, description: e.target.value})}
                            />
                        </Form.Group>
                        <Button type="submit" variant="primary">
                            {selectedBook ? 'Update Book' : 'Add Book'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default BookManagement;