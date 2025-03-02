import React from "react";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import { FaUsers, FaBook, FaDollarSign, FaClipboardList } from "react-icons/fa";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="text-center">Admin Panel</h2>
        <a href="#">Dashboard</a>
        <a href="#">Manage Books</a>
        <a href="#">Manage Users</a>
        <a href="#">Issued Books</a>
        <a href="#">Reports</a>
        <a href="#">Settings</a>
      </div>

      {/* Main Content */}
      <div className="content">
        <Container fluid>
          <Row>
            <Col md={3}>
              <Card className="stats-card">
                <Card.Body>
                  <FaUsers size={30} />
                  <h3>1,200</h3>
                  <p>Registered Users</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stats-card">
                <Card.Body>
                  <FaBook size={30} />
                  <h3>5,000</h3>
                  <p>Books Available</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stats-card">
                <Card.Body>
                  <FaClipboardList size={30} />
                  <h3>320</h3>
                  <p>Books Issued</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="stats-card">
                <Card.Body>
                  <FaDollarSign size={30} />
                  <h3>$2,500</h3>
                  <p>Revenue</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Book Issued Table */}
          <Card className="mt-4">
            <Card.Body>
              <h4>Recently Issued Books</h4>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student Name</th>
                    <th>Book Title</th>
                    <th>Issued Date</th>
                    <th>Return Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Amit Sharma</td>
                    <td>Atomic Habits</td>
                    <td>Feb 10, 2025</td>
                    <td>Feb 20, 2025</td>
                    <td><Button variant="success" size="sm">Returned</Button></td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Neha Gupta</td>
                    <td>The Psychology of Money</td>
                    <td>Feb 12, 2025</td>
                    <td>Feb 22, 2025</td>
                    <td><Button variant="warning" size="sm">Pending</Button></td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
};

export default AdminDashboard;
