import React, { useState, useEffect } from 'react';
import { Card, Button, Table } from 'react-bootstrap';
import axios from 'axios';

const AttendanceTracker = () => {
  const [attendance, setAttendance] = useState([]);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  useEffect(() => {
    fetchAttendance();
    checkTodayStatus();
  }, []);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/attendance/my-attendance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendance(response.data.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const checkTodayStatus = async () => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = attendance.find(record => 
      record.date.split('T')[0] === today && !record.check_out
    );
    setIsCheckedIn(!!todayRecord);
  };

  const handleCheckIn = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/attendance/check-in', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsCheckedIn(true);
      fetchAttendance();
    } catch (error) {
      console.error('Error checking in:', error);
    }
  };

  const handleCheckOut = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/attendance/check-out', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsCheckedIn(false);
      fetchAttendance();
    } catch (error) {
      console.error('Error checking out:', error);
    }
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5>Attendance Tracker</h5>
        <div>
          {!isCheckedIn ? (
            <Button variant="success" onClick={handleCheckIn}>Check In</Button>
          ) : (
            <Button variant="warning" onClick={handleCheckOut}>Check Out</Button>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        <Table hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record.id}>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>{new Date(record.check_in).toLocaleTimeString()}</td>
                <td>
                  {record.check_out 
                    ? new Date(record.check_out).toLocaleTimeString() 
                    : '-'}
                </td>
                <td>{record.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default AttendanceTracker;