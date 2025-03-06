import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import './StudentSidebar.css';

const StudentSidebar = () => {    // Changed from Sidebar to StudentSidebar
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const studentLinks = [
        { path: '/student/dashboard', icon: 'fas fa-home', text: 'Dashboard' },
        { path: '/student/books', icon: 'fas fa-book', text: 'Books' },
        { path: '/student/borrowings', icon: 'fas fa-list', text: 'My Borrowings' },
        { path: '/student/attendance', icon: 'fas fa-calendar-check', text: 'Attendance' },
        { path: '/student/profile', icon: 'fas fa-user', text: 'Profile' }
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <i className="fas fa-book-reader"></i>
                <h3>Library System</h3>
            </div>
            <Nav className="flex-column">
                {studentLinks.map((link) => (
                    <Nav.Item key={link.path}>
                        <Link
                            to={link.path}
                            className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                        >
                            <i className={link.icon}></i>
                            <span>{link.text}</span>
                        </Link>
                    </Nav.Item>
                ))}
            </Nav>
            <div className="sidebar-footer">
                <Link to="/logout" className="nav-link">
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </Link>
            </div>
        </div>
    );
};

export default StudentSidebar;