import React, { useState, useEffect } from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import axios from 'axios';
import './StudentAttendance.css';

const StudentAttendance = () => {
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/student/attendance', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAttendance(response.data);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        }
    };

    return (
        <div className="student-attendance">
            <Card>
                <Card.Header>
                    <h5>My Attendance Record</h5>
                </Card.Header>
                <Card.Body>
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Check In Time</th>
                                <th>Check Out Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.map((record) => (
                                <tr key={record.id}>
                                    <td>{new Date(record.date).toLocaleDateString()}</td>
                                    <td>{record.check_in_time || 'N/A'}</td>
                                    <td>{record.check_out_time || 'N/A'}</td>
                                    <td>
                                        <Badge bg={
                                            record.status === 'present' ? 'success' :
                                            record.status === 'late' ? 'warning' : 'danger'
                                        }>
                                            {record.status}
                                        </Badge>
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

export default StudentAttendance;