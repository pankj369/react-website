import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Register.css";  // ✅ Add custom styles
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user makes changes
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate all required fields
    if (!formData.fullName || !formData.email || !formData.contact || 
        !formData.batch || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        fullname: formData.fullName,    // Changed from name to fullname
        email: formData.email,
        contact: formData.contact,
        batch: formData.batch,
        password: formData.password,
        role: userType
      });

      if (response.data) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate(userType === 'admin' ? '/admin/dashboard' : '/student/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="auth-background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="register-card">
              <Card.Body>
                <div className="auth-header">
                  <div className="auth-logo">
                    <i className="fas fa-user-plus"></i>
                  </div>
                  <h3>Create Account</h3>
                  <p>Join our library community</p>
                </div>

                {error && (
                  <Alert variant="danger" className="animated fadeIn">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <div className="form-icon">
                      <i className="fas fa-user"></i>
                      <Form.Control
                        type="text"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <div className="form-icon">
                      <i className="fas fa-envelope"></i>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <div className="form-icon">
                      <i className="fas fa-phone"></i>
                      <Form.Control
                        type="tel"
                        name="contact"
                        placeholder="Enter your contact number"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <div className="form-icon">
                      <i className="fas fa-clock"></i>
                      <Form.Select 
                        name="batch" 
                        value={formData.batch} 
                        onChange={handleChange} 
                        required
                      >
                        <option value="">Select Batch</option>
                        <option value="Morning (8AM - 12PM)">Morning (8AM - 12PM)</option>
                        <option value="Afternoon (12PM - 4PM)">Afternoon (12PM - 4PM)</option>
                        <option value="Evening (4PM - 8PM)">Evening (4PM - 8PM)</option>
                      </Form.Select>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <div className="form-icon">
                      <i className="fas fa-lock"></i>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <div className="form-icon">
                      <i className="fas fa-lock"></i>
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </Form.Group>

                  <div className="user-type-selection mb-4">
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

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className={`w-100 ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Creating Account...
                      </>
                    ) : (
                      `Register as ${userType === "admin" ? "Admin" : "Student"}`
                    )}
                  </Button>

                  <p className="text-center mt-4">
                    Already have an account? <Link to="/login">Login</Link>
                  </p>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
