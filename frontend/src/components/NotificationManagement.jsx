import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentNotification, setCurrentNotification] = useState({ title: '', message: '' });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('http://localhost:5000/api/admin/notifications', { headers });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleAddNotification = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post('http://localhost:5000/api/admin/notifications', currentNotification, { headers });
      if (response.data.success) {
        setNotifications([...notifications, response.data.notification]);
        setShowModal(false);
        setCurrentNotification({ title: '', message: '' });
      }
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`http://localhost:5000/api/admin/notifications/${id}`, { headers });
      setNotifications(notifications.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div>
      <Button variant="primary" onClick={() => setShowModal(true)}>Add Notification</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Message</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map(notification => (
            <tr key={notification.id}>
              <td>{notification.title}</td>
              <td>{notification.message}</td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteNotification(notification.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddNotification}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" value={currentNotification.title} onChange={(e) => setCurrentNotification({ ...currentNotification, title: e.target.value })} required />
            </Form.Group>
            <Form.Group controlId="formMessage">
              <Form.Label>Message</Form.Label>
              <Form.Control type="text" value={currentNotification.message} onChange={(e) => setCurrentNotification({ ...currentNotification, message: e.target.value })} required />
            </Form.Group>
            <Button type="submit" variant="primary">Add Notification</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default NotificationManagement;
