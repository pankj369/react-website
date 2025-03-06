import React from 'react';
import { Container, Row, Col, Dropdown } from 'react-bootstrap';
import './AdminHeader.css';

const AdminHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="admin-header">
            <Container fluid>
                <Row className="align-items-center">
                    <Col>
                        <h1>Admin Dashboard</h1>
                        <p className="text-muted">Manage your library system</p>
                    </Col>
                    <Col xs="auto">
                        <div className="header-actions">
                            <div className="notification-bell">
                                <i className="fas fa-bell"></i>
                                <span className="notification-badge">5</span>
                            </div>
                            <Dropdown>
                                <Dropdown.Toggle variant="link" className="profile-dropdown">
                                    <img 
                                        src={`https://ui-avatars.com/api/?name=${user?.fullname}&background=random`} 
                                        alt="Profile" 
                                        className="profile-image"
                                    />
                                    <span className="profile-name">{user?.fullname}</span>
                                </Dropdown.Toggle>

                                <Dropdown.Menu align="end">
                                    <Dropdown.Item href="/admin/profile">
                                        <i className="fas fa-user me-2"></i>Profile
                                    </Dropdown.Item>
                                    <Dropdown.Item href="/admin/settings">
                                        <i className="fas fa-cog me-2"></i>Settings
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={() => {
                                        localStorage.clear();
                                        window.location.href = '/login';
                                    }}>
                                        <i className="fas fa-sign-out-alt me-2"></i>Logout
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AdminHeader;