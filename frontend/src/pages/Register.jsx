import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Register.css";  // ✅ Add custom styles

const Register = () => {
  const [userType, setUserType] = useState("student");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    batch: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert(`${userType.toUpperCase()} registered successfully!`);
  };

  return (
    <Container className="register-container">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="register-card shadow-lg">
            <Card.Body>
              <h3 className="text-center mb-4">Sign Up</h3>
              <Form onSubmit={handleSubmit}>
                {/* Full Name */}
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Contact Number */}
                <Form.Group className="mb-3">
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="contact"
                    placeholder="Enter your contact number"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Batch Selection */}
                <Form.Group className="mb-3">
                  <Form.Label>Select Batch</Form.Label>
                  <Form.Select name="batch" value={formData.batch} onChange={handleChange} required>
                    <option value="">Choose...</option>
                    <option value="Morning (8AM - 12PM)">Morning (8AM - 12PM)</option>
                    <option value="Afternoon (12PM - 4PM)">Afternoon (12PM - 4PM)</option>
                    <option value="Evening (4PM - 8PM)">Evening (4PM - 8PM)</option>
                  </Form.Select>
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Confirm Password */}
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Admin or Student Signup */}
                <div className="mb-3">
                  <Form.Check
                    inline
                    label="Student"
                    type="radio"
                    name="userType"
                    value="student"
                    checked={userType === "student"}
                    onChange={() => setUserType("student")}
                  />
                  <Form.Check
                    inline
                    label="Admin"
                    type="radio"
                    name="userType"
                    value="admin"
                    checked={userType === "admin"}
                    onChange={() => setUserType("admin")}
                  />
                </div>

                {/* Register Button */}
                <Button variant="primary" type="submit" className="w-100">
                  {userType === "admin" ? "Register as Admin" : "Register as Student"}
                </Button>
              </Form>

              {/* Already have an account? */}
              <p className="text-center mt-3">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
