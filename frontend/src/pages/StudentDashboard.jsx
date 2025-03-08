import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import './StudentDashboard.css';
import BorrowingList from '../components/BorrowingList';
import AttendanceTracker from '../components/AttendanceTracker';
import StudentSidebar from '../components/StudentSidebar';  

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
      <StudentSidebar />
      <div className="main-content">
        <Container fluid>
          {/* Profile Section */}
          <Row className="mb-4">
            <Col>
              <Card className="profile-card">
                <Card.Body>
                  <div className="profile-header">
                    <div className="profile-avatar">
                      <img src="/default-avatar.png" alt={user?.fullname} />
                    </div>
                    <div className="profile-info">
                      <h3>{user?.fullname}</h3>
                      <p>{user?.email}</p>
                      <Button 
                        variant="light" 
                        onClick={() => setShowProfileModal(true)}
                        className="edit-btn"
                      >
                        <i className="fas fa-edit"></i> Edit Profile
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Dashboard Content */}
          <Row className="mt-4">
            <Col md={7}>
              <BorrowingList />
            </Col>
            <Col md={5}>
              <AttendanceTracker />
            </Col>
          </Row>
        </Container>

        {/* Profile Edit Modal */}
        <Modal 
          show={showProfileModal} 
          onHide={() => setShowProfileModal(false)}
          className="profile-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleProfileUpdate}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  value={profileData.fullname}
                  onChange={(e) => setProfileData({...profileData, fullname: e.target.value})}
                  className="form-input"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={profileData.email}
                  disabled
                  className="form-input"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  type="text"
                  value={profileData.contact}
                  onChange={(e) => setProfileData({...profileData, contact: e.target.value})}
                  className="form-input"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Batch</Form.Label>
                <Form.Select
                  value={profileData.batch}
                  onChange={(e) => setProfileData({...profileData, batch: e.target.value})}
                  className="form-input"
                >
                  <option value="">Select Batch</option>
                  <option value="Morning">Morning (8AM - 12PM)</option>
                  <option value="Afternoon">Afternoon (12PM - 4PM)</option>
                  <option value="Evening">Evening (4PM - 8PM)</option>
                </Form.Select>
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100">
                Update Profile
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default StudentDashboard;