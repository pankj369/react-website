import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import './StudentDashboard.css';
import BorrowingList from '../components/BorrowingList';
import AttendanceTracker from '../components/AttendanceTracker';

const StudentDashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    contact: user?.contact || '',
    batch: user?.batch || ''
  });
  const [notifications, setNotifications] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch notifications
      const notifResponse = await axios.get('http://localhost:5000/api/notifications', { headers });
      setNotifications(notifResponse.data);

      // Fetch attendance
      const attendanceResponse = await axios.get('http://localhost:5000/api/attendance', { headers });
      setAttendance(attendanceResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        profileData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setShowProfileModal(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="student-dashboard">
      <Sidebar />
      <div className="main-content">
        <DashboardHeader />
        <Container fluid>
          {/* Existing stats row */}
          <Row className="mt-4">
            <Col md={7}>
              <BorrowingList />
            </Col>
            <Col md={5}>
              <AttendanceTracker />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default StudentDashboard;