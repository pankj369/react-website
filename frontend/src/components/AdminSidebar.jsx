import React from 'react';
import { Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="admin-sidebar">
            <div className="sidebar-header">
                <h3>Admin Portal</h3>
                <p className="user-info">{user?.fullname}</p>
            </div>
            <Nav className="flex-column">
                <Nav.Link onClick={() => navigate('/admin-dashboard')}>
                    <i className="fas fa-chart-line me-2"></i>Dashboard
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/admin/books')}>
                    <i className="fas fa-book me-2"></i>Manage Books
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/admin/students')}>
                    <i className="fas fa-users me-2"></i>Manage Students
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/admin/borrowings')}>
                    <i className="fas fa-exchange-alt me-2"></i>Borrowings
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/admin/reports')}>
                    <i className="fas fa-file-alt me-2"></i>Reports
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/admin/settings')}>
                    <i className="fas fa-cog me-2"></i>Settings
                </Nav.Link>
            </Nav>
            <div className="sidebar-footer">
                <button 
                    className="logout-btn"
                    onClick={() => {
                        localStorage.clear();
                        navigate('/login');
                    }}
                >
                    <i className="fas fa-sign-out-alt me-2"></i>Logout
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;