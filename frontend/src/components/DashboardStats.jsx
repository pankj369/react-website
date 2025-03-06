import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import './DashboardStats.css';

const DashboardStats = ({ stats }) => {
    return (
        <Row className="dashboard-stats">
            <Col md={3}>
                <Card className="stat-card">
                    <Card.Body>
                        <div className="stat-icon books">
                            <i className="fas fa-book"></i>
                        </div>
                        <div className="stat-details">
                            <h3>{stats?.totalBooks || 0}</h3>
                            <p>Total Books</p>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={3}>
                <Card className="stat-card">
                    <Card.Body>
                        <div className="stat-icon students">
                            <i className="fas fa-users"></i>
                        </div>
                        <div className="stat-details">
                            <h3>{stats?.totalStudents || 0}</h3>
                            <p>Total Students</p>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={3}>
                <Card className="stat-card">
                    <Card.Body>
                        <div className="stat-icon borrowings">
                            <i className="fas fa-hand-holding-heart"></i>
                        </div>
                        <div className="stat-details">
                            <h3>{stats?.activeBorrowings || 0}</h3>
                            <p>Active Borrowings</p>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={3}>
                <Card className="stat-card">
                    <Card.Body>
                        <div className="stat-icon overdue">
                            <i className="fas fa-clock"></i>
                        </div>
                        <div className="stat-details">
                            <h3>{stats?.overdueBooks || 0}</h3>
                            <p>Overdue Books</p>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default DashboardStats;