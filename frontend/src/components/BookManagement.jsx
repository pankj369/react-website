import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Table, Button, Badge, Form, InputGroup } from 'react-bootstrap';

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching book data:', error);
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
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5>Book Management</h5>
          <InputGroup className="w-50">
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
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2">
                    <i className="fas fa-edit"></i>
                  </Button>
                  <Button variant="outline-danger" size="sm">
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default BookManagement;
