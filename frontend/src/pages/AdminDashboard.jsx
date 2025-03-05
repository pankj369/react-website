import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import StudentManagement from '../components/StudentManagement';
import BookManagement from '../components/BookManagement';
import Reports from '../components/Reports';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    quantity: '',
    category: ''
  });
  const [profileData, setProfileData] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    contact: user?.contact || ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch students
      const studentsResponse = await axios.get('http://localhost:5000/api/admin/students', { headers });
      setStudents(studentsResponse.data);

      // Fetch books
      const booksResponse = await axios.get('http://localhost:5000/api/admin/books', { headers });
      setBooks(booksResponse.data);

      // Fetch notifications
      const notifResponse = await axios.get('http://localhost:5000/api/admin/notifications', { headers });
      setNotifications(notifResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/admin/books',
        newBook,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setBooks([...books, response.data.book]);
        setShowAddBookModal(false);
        setNewBook({ title: '', author: '', isbn: '', quantity: '', category: '' });
      }
    } catch (error) {
      console.error('Error adding book:', error);
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
    <div className="admin-dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <i className="fas fa-user-shield"></i>
          <h3>Admin Portal</h3>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-home"></i>
            <span>Overview</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            <i className="fas fa-users"></i>
            <span>Students</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            <i className="fas fa-book"></i>
            <span>Books</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <i className="fas fa-chart-bar"></i>
            <span>Reports</span>
          </button>
        </nav>
      </div>

      <div className="main-content">
        <header className="dashboard-header">
          <div className="header-search">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search..." />
          </div>
          <div className="admin-profile">
            <div className="notifications">
              <i className="fas fa-bell"></i>
              <span className="badge">{notifications.length}</span>
            </div>
            <img 
              src={user?.profileImage || "https://via.placeholder.com/40"} 
              alt="Profile" 
              onClick={() => setShowProfileModal(true)}
            />
            <span>{user?.fullname}</span>
          </div>
        </header>

        <Container fluid className="dashboard-content">
          <Row className="stats-row">
            <Col md={3}>
              <Card className="stat-card">
                <Card.Body>
                  <div className="stat-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{students.length}</h3>
                    <p>Total Students</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stat-card">
                <Card.Body>
                  <div className="stat-icon">
                    <i className="fas fa-book"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{books.length}</h3>
                    <p>Total Books</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            {/* Add more stat cards */}
          </Row>

          <Row className="mt-4">
            <Col>
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5>Recent Book Borrowings</h5>
                  <Button variant="outline-primary" size="sm">
                    View All
                  </Button>
                </Card.Header>
                <Card.Body>
                  <BorrowingList />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={8}>
              {/* Existing books management table */}
            </Col>
            <Col md={4}>
              <AttendanceTracker />
            </Col>
          </Row>
        </Container>

        {/* Add Book Modal */}
        <Modal show={showAddBookModal} onHide={() => setShowAddBookModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Book</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAddBook}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={newBook.title}
                  onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  type="text"
                  value={newBook.author}
                  onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>ISBN</Form.Label>
                <Form.Control
                  type="text"
                  value={newBook.isbn}
                  onChange={(e) => setNewBook({...newBook, isbn: e.target.value})}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  value={newBook.quantity}
                  onChange={(e) => setNewBook({...newBook, quantity: e.target.value})}
                  required
                />
              </Form.Group>
              <Button type="submit" variant="primary">Add Book</Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Profile Modal */}
        <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
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
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  type="tel"
                  value={profileData.contact}
                  onChange={(e) => setProfileData({...profileData, contact: e.target.value})}
                />
              </Form.Group>
              <Button type="submit" variant="primary">Save Changes</Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;