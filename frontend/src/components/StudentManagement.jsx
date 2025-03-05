import React, { useState } from 'react';
import { Card, Table, Button, Badge, Form, InputGroup } from 'react-bootstrap';

const StudentManagement = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('fullname');
  const [sortDirection, setSortDirection] = useState('asc');

  const filteredStudents = students.filter(student =>
    student.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.batch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
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
          <h5>Student Management</h5>
          <InputGroup className="w-50">
            <Form.Control
              placeholder="Search students..."
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
              <th onClick={() => handleSort('fullname')} style={{ cursor: 'pointer' }}>
                Full Name {sortField === 'fullname' && <i className={`fas fa-sort-${sortDirection}`}></i>}
              </th>
              <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                Email {sortField === 'email' && <i className={`fas fa-sort-${sortDirection}`}></i>}
              </th>
              <th onClick={() => handleSort('batch')} style={{ cursor: 'pointer' }}>
                Batch {sortField === 'batch' && <i className={`fas fa-sort-${sortDirection}`}></i>}
              </th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.fullname}</td>
                <td>{student.email}</td>
                <td>{student.batch}</td>
                <td>{student.contact}</td>
                <td>
                  <Badge bg={student.active ? 'success' : 'danger'}>
                    {student.active ? 'Active' : 'Inactive'}
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

export default StudentManagement;