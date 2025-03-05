import React, { useState, useEffect } from 'react';
import { Table, Badge } from 'react-bootstrap';
import axios from 'axios';

const BorrowingList = () => {
  const [borrowings, setBorrowings] = useState([]);

  useEffect(() => {
    const fetchBorrowings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/borrowings/my-borrowings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBorrowings(response.data.data);
      } catch (error) {
        console.error('Error fetching borrowings:', error);
      }
    };

    fetchBorrowings();
  }, []);

  const getBadgeVariant = (status) => {
    switch (status) {
      case 'borrowed': return 'warning';
      case 'returned': return 'success';
      case 'overdue': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <Table hover responsive>
      <thead>
        <tr>
          <th>Book Title</th>
          <th>Borrow Date</th>
          <th>Due Date</th>
          <th>Return Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {borrowings.map((borrowing) => (
          <tr key={borrowing.id}>
            <td>{borrowing.title}</td>
            <td>{new Date(borrowing.borrow_date).toLocaleDateString()}</td>
            <td>{new Date(borrowing.due_date).toLocaleDateString()}</td>
            <td>
              {borrowing.return_date 
                ? new Date(borrowing.return_date).toLocaleDateString() 
                : '-'}
            </td>
            <td>
              <Badge bg={getBadgeVariant(borrowing.status)}>
                {borrowing.status}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default BorrowingList;