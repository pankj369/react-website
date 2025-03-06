import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Form, InputGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import './StudentBooks.css';

const StudentBooks = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('title');
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/books', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBooks(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
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
        <div className="student-books">
            <Card>
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                        <h5>Available Books</h5>
                        <InputGroup className="w-auto">
                            <Form.Control
                                placeholder="Search books..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button variant="outline-secondary">
                                <i className="fas fa-search"></i>
                            </Button>
                        </InputGroup>
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
                                <th>Category</th>
                                <th>Available</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedBooks.map((book) => (
                                <tr key={book.id}>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.isbn}</td>
                                    <td>{book.category}</td>
                                    <td>
                                        <Badge bg={book.available > 0 ? 'success' : 'danger'}>
                                            {book.available}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button 
                                            variant="primary" 
                                            size="sm" 
                                            disabled={book.available === 0}
                                        >
                                            Borrow
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
};

export default StudentBooks;