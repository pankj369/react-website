import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import StudentManagement from '../components/StudentManagement';
import BookManagement from '../components/BookManagement';
import NotificationManagement from '../components/NotificationManagement';
import Reports from '../components/Reports';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import DashboardStats from '../components/DashboardStats';
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
  const [reportData, setReportData] = useState({
    borrowingData: null,
    attendanceData: null,
    booksData: null
  });

  useEffect(() => {
    fetchDashboardData();
    fetchReportData();
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

  const fetchReportData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [borrowings, attendance, bookStats] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/reports/borrowings', { headers }),
        axios.get('http://localhost:5000/api/admin/reports/attendance', { headers }),
        axios.get('http://localhost:5000/api/admin/reports/books', { headers })
      ]);

      setReportData({
        borrowingData: borrowings.data,
        attendanceData: attendance.data,
        booksData: bookStats.data
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  const renderOverviewTab = () => (
    <>
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
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon">
                <i className="fas fa-book-reader"></i>
              </div>
              <div className="stat-info">
                <h3>{reportData.borrowingData?.totalActive || 0}</h3>
                <p>Active Borrowings</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-info">
                <h3>{reportData.borrowingData?.overdue || 0}</h3>
                <p>Overdue Books</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={8}>
          <Card>
            <Card.Header>Recent Activities</Card.Header>
            <Card.Body>
              <Reports {...reportData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>Quick Actions</Card.Header>
            <Card.Body>
              <Button variant="primary" className="w-100 mb-2" onClick={() => setShowAddBookModal(true)}>
                <i className="fas fa-plus me-2"></i>Add New Book
              </Button>
              <Button variant="outline-primary" className="w-100">
                <i className="fas fa-file-export me-2"></i>Export Reports
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );

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
            <span>Students Management</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <i className="fas fa-bell"></i>
            <span>Notifications</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            <i className="fas fa-book"></i>
            <span>Books Management</span>
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
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="overview" title="Overview">
              {renderOverviewTab()}
            </Tab>
            <Tab eventKey="students" title="Students">
              <StudentManagement students={students} />
            </Tab>
            <Tab eventKey="notifications" title="Notifications">
              <NotificationManagement />
            </Tab>
            <Tab eventKey="books" title="Books">
              <BookManagement
                books={books}
                onAddBook={handleAddBook}
                onUpdateBook={handleProfileUpdate}
                onDeleteBook={(id) => console.log('Delete book:', id)}
              />
            </Tab>
            <Tab eventKey="reports" title="Reports">
              <Reports {...reportData} />
            </Tab>
          </Tabs>
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
