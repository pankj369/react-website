import React, { useState } from 'react';
import { Card, Row, Col, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios'; // Add this import
import './StudentProfile.css';

const StudentProfile = ({ user }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    contact: user?.contact || '',
    batch: user?.batch || ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/student/profile',
        formData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setSuccess('Profile updated successfully!');
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setTimeout(() => {
          setShowEditModal(false);
          window.location.reload(); // Refresh to show updated data
        }, 1500);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="profile-card">
        <Card.Body>
          <div className="profile-header">
            <div className="profile-avatar">
              <img src={user?.avatar || '/default-avatar.png'} alt="Profile" />
              <div className="profile-status online"></div>
            </div>
            <div className="profile-info">
              <h2>{user?.fullname}</h2>
              <p className="student-id">ID: {user?.studentId}</p>
              <div className="profile-badges">
                <span className="badge-custom active">Active Student</span>
                <span className="badge-custom">{user?.batch}</span>
              </div>
            </div>
            <Button 
              variant="outline-primary" 
              className="edit-profile-btn"
              onClick={() => setShowEditModal(true)}
            >
              <i className="fas fa-edit"></i> Edit Profile
            </Button>
          </div>

          <Row className="profile-details mt-4">
            <Col md={6}>
              <div className="detail-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <label>Email</label>
                  <p>{user?.email}</p>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="detail-item">
                <i className="fas fa-phone"></i>
                <div>
                  <label>Contact</label>
                  <p>{user?.contact}</p>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="detail-item">
                <i className="fas fa-clock"></i>
                <div>
                  <label>Batch Timing</label>
                  <p>{user?.batch}</p>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="detail-item">
                <i className="fas fa-calendar-check"></i>
                <div>
                  <label>Join Date</label>
                  <p>{new Date(user?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.fullname}
                onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="tel"
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Batch</Form.Label>
              <Form.Select
                value={formData.batch}
                onChange={(e) => setFormData({...formData, batch: e.target.value})}
                required
              >
                <option value="">Select Batch</option>
                <option value="Morning (8AM - 12PM)">Morning (8AM - 12PM)</option>
                <option value="Afternoon (12PM - 4PM)">Afternoon (12PM - 4PM)</option>
                <option value="Evening (4PM - 8PM)">Evening (4PM - 8PM)</option>
              </Form.Select>
            </Form.Group>

            <div className="d-grid">
              <Button type="submit" variant="primary">
                Update Profile
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default StudentProfile;