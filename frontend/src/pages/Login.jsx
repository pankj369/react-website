import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Remember me functionality
        if (formData.rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-wrapper">
      <div className="auth-background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <div className="auth-card">
              <div className="auth-header">
                <div className="auth-logo">
                  <i className="fas fa-book-reader"></i>
                </div>
                <h2>Welcome Back!</h2>
                <p>Please login to your account</p>
              </div>

              {error && (
                <Alert variant="danger" className="animated fadeIn">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} className="auth-form">
                <Form.Group className="form-group">
                  <div className="form-icon">
                    <i className="fas fa-envelope"></i>
                    <Form.Control
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="input-field"
                    />
                    <span className="focus-border"></span>
                  </div>
                </Form.Group>

                <Form.Group className="form-group">
                  <div className="form-icon">
                    <i className="fas fa-lock"></i>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      className="input-field"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                    <span className="focus-border"></span>
                  </div>
                </Form.Group>

                <div className="form-extras">
                  <Form.Check
                    type="checkbox"
                    label="Remember me"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                    className="remember-check"
                  />
                  <Link to="/forgot-password" className="forgot-link">
                    Forgot Password?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className={`auth-button ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Logging in...
                    </>
                  ) : 'Login'}
                </Button>

                <div className="auth-separator">
                  <span>Or continue with</span>
                </div>

                <div className="social-buttons">
                  <button type="button" className="social-btn google">
                    <i className="fab fa-google"></i>
                  </button>
                  <button type="button" className="social-btn facebook">
                    <i className="fab fa-facebook-f"></i>
                  </button>
                  <button type="button" className="social-btn github">
                    <i className="fab fa-github"></i>
                  </button>
                </div>

                <p className="register-prompt">
                  Don't have an account? 
                  <Link to="/register" className="register-link">
                    Register now
                  </Link>
                </p>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;