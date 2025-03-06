import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button } from 'react-bootstrap';
import axios from 'axios';
import './StudentBorrowings.css';

const StudentBorrowings = () => {
    const [borrowings, setBorrowings] = useState([]);

    useEffect(() => {
        fetchBorrowings();
    }, []);

    const fetchBorrowings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/student/borrowings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBorrowings(response.data);
        } catch (error) {
            console.error('Error fetching borrowings:', error);
        }
    };

    const handleReturn = async (borrowingId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/student/borrowings/${borrowingId}/return`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBorrowings();
        } catch (error) {
            console.error('Error returning book:', error);
        }
    };

    return (
        <div className="student-borrowings">
            <Card>
                <Card.Header>
                    <h5>My Borrowings</h5>
                </Card.Header>
                <Card.Body>
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>Book Title</th>
                                <th>Borrowed Date</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrowings.map((borrowing) => (
                                <tr key={borrowing.id}>
                                    <td>{borrowing.book_title}</td>
                                    <td>{new Date(borrowing.borrow_date).toLocaleDateString()}</td>
                                    <td>{new Date(borrowing.due_date).toLocaleDateString()}</td>
                                    <td>
                                        <Badge bg={borrowing.status === 'returned' ? 'success' : 
                                            new Date(borrowing.due_date) < new Date() ? 'danger' : 'warning'}>
                                            {borrowing.status}
                                        </Badge>
                                    </td>
                                    <td>
                                        {borrowing.status === 'borrowed' && (
                                            <Button 
                                                variant="primary" 
                                                size="sm"
                                                onClick={() => handleReturn(borrowing.id)}
                                            >
                                                Return Book
                                            </Button>
                                        )}
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

export default StudentBorrowings;