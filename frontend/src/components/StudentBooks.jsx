import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import './StudentBooks.css';

const StudentBooks = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || book.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <StudentLayout>
      <Container fluid>
        <div className="books-header">
          <h2>Library Books</h2>
          <div className="search-filters">
            <Row>
              <Col md={8}>
                <InputGroup className="search-bar">
                  <InputGroup.Text>
                    <i className="fas fa-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search books by title or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={4}>
                <Form.Select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="category-filter"
                >
                  <option value="all">All Categories</option>
                  <option value="fiction">Fiction</option>
                  <option value="non-fiction">Non-Fiction</option>
                  <option value="science">Science</option>
                  <option value="technology">Technology</option>
                  <option value="history">History</option>
                </Form.Select>
              </Col>
            </Row>
          </div>
        </div>

        <Row className="books-grid">
          {loading ? (
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading books...</p>
            </div>
          ) : (
            filteredBooks.map(book => (
              <Col key={book.id} lg={3} md={4} sm={6} xs={12}>
                <Card className="book-card">
                  <div className="book-cover">
                    <img src={book.coverImage || '/default-book.png'} alt={book.title} />
                    <div className="book-status">
                      <span className={`status-badge ${book.available ? 'available' : 'borrowed'}`}>
                        {book.available ? 'Available' : 'Borrowed'}
                      </span>
                    </div>
                  </div>
                  <Card.Body>
                    <h3>{book.title}</h3>
                    <p className="author">by {book.author}</p>
                    <div className="book-details">
                      <span><i className="fas fa-bookmark"></i> {book.category}</span>
                      <span><i className="fas fa-hashtag"></i> {book.isbn}</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </StudentLayout>
  );
};

export default StudentBooks;