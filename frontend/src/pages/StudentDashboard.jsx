import React from "react";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import { FaBookOpen, FaHistory, FaUser, FaCalendarAlt } from "react-icons/fa";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  return (
    <div className="student-dashboard">
      {/* Sidebar */}
      <div className="student-sidebar">
        <h2 className="text-center">Student Panel</h2>
        <a href="#">Dashboard</a>
        <a href="#">My Books</a>
        <a href="#">Issued History</a>
        <a href="#">Profile</a>
        <a href="#">Settings</a>
      </div>

      {/* Main Content */}
      <div className="student-content">
        <Container fluid>
          <Row>
            <Col md={3}>
              <Card className="student-card">
                <Card.Body>
                  <FaBookOpen size={30} />
                  <h3>8</h3>
                  <p>Books Borrowed</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="student-card">
                <Card.Body>
                  <FaHistory size={30} />
                  <h3>15</h3>
                  <p>Returned Books</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="student-card">
                <Card.Body>
                  <FaCalendarAlt size={30} />
                  <h3>2</h3>
                  <p>Due Books</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="student-card">
                <Card.Body>
                  <FaUser size={30} />
                  <h3>John Doe</h3>
                  <p>Student ID: 12345</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Borrowed Books Table */}
          <Card className="mt-4">
            <Card.Body>
              <h4>Borrowed Books</h4>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Book Title</th>
                    <th>Author</th>
                    <th>Issued Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Rich Dad Poor Dad</td>
                    <td>Robert Kiyosaki</td>
                    <td>Feb 10, 2025</td>
                    <td>Feb 20, 2025</td>
                    <td><Button variant="warning" size="sm">Pending</Button></td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>The Alchemist</td>
                    <td>Paulo Coelho</td>
                    <td>Jan 25, 2025</td>
                    <td>Feb 5, 2025</td>
                    <td><Button variant="success" size="sm">Returned</Button></td>
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

export default StudentDashboard;
