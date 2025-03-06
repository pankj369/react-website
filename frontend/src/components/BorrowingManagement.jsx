import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import './BorrowingManagement.css';

const BorrowingManagement = () => {
    const [borrowings, setBorrowings] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchBorrowings();
    }, []);

    const fetchBorrowings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/admin/borrowings', {
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
            await axios.put(`http://localhost:5000/api/admin/borrowings/${borrowingId}/return`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBorrowings();
        } catch (error) {
            console.error('Error returning book:', error);
        }
    };

    const filteredBorrowings = borrowings.filter(borrowing => {
        if (filter === 'all') return true;
        return borrowing.status === filter;
    });

    return (
        <div className="borrowing-management">
            <Card>
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                        <h5>Borrowing Management</h5>
                        <Form.Select 
                            style={{ width: 'auto' }}
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All Borrowings</option>
                            <option value="borrowed">Borrowed</option>
                            <option value="returned">Returned</option>
                            <option value="overdue">Overdue</option>
                        </Form.Select>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Book Title</th>
                                <th>Borrow Date</th>
                                <th>Due Date</th>
                                <th>Return Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBorrowings.map((borrowing) => (
                                <tr key={borrowing.id}>
                                    <td>{borrowing.student_name}</td>
                                    <td>{borrowing.book_title}</td>
                                    <td>{new Date(borrowing.borrow_date).toLocaleDateString()}</td>
                                    <td>{new Date(borrowing.due_date).toLocaleDateString()}</td>
                                    <td>
                                        {borrowing.return_date 
                                            ? new Date(borrowing.return_date).toLocaleDateString() 
                                            : '-'
                                        }
                                    </td>
                                    <td>
                                        <Badge bg={
                                            borrowing.status === 'returned' ? 'success' :
                                            borrowing.status === 'overdue' ? 'danger' : 'warning'
                                        }>
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
                                                Mark as Returned
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

export default BorrowingManagement;