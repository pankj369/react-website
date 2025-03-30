import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/admin/students', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch students');
            setLoading(false);
        }
    };

    const handleStatusChange = async (studentId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/students/${studentId}/status`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            fetchStudents();
        } catch (error) {
            setError('Failed to update student status');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <Container className="py-4">
            <h2 className="mb-4">Student Management</h2>
            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Contact</th>
                        <th>Batch</th>
                        <th>Registration Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.fullname}</td>
                            <td>{student.email}</td>
                            <th>{student.contact}</th>
                            <td>{student.batch}</td>
                            <td>{new Date(student.created_at).toLocaleDateString()}</td>
                            <td>{student.status}</td>
                            <td>
                                <Button 
                                    variant={student.status === 'active' ? 'danger' : 'success'}
                                    size="sm"
                                    onClick={() => handleStatusChange(
                                        student.id, 
                                        student.status === 'active' ? 'inactive' : 'active'
                                    )}
                                >
                                    {student.status === 'active' ? 'Deactivate' : 'Activate'}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default StudentManagement;
