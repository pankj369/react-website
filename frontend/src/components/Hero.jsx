import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from 'react-bootstrap';
import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-overlay">
        <Container>
          <Row className="align-items-center text-center text-md-start">
            <Col md={7} className="hero-content">
              <h1 className="display-3 fw-bold text-white mb-4">
                Welcome to <span className="text-primary">SuccessLibrary</span>
              </h1>
              <p className="lead text-white mb-4">
                Discover thousands of books, research materials, and digital resources. 
                Your gateway to knowledge and learning excellence.
              </p>
              <div className="hero-buttons">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="me-3 mb-3"
                  onClick={() => navigate("/catalog")}
                >
                  Browse Books
                </Button>
                <Button 
                  variant="outline-light" 
                  size="lg" 
                  className="mb-3"
                >
                  Learn More
                </Button>
              </div>
              <div className="hero-features mt-5">
                <div className="feature-item">
                  <i className="fas fa-book-reader"></i>
                  <span>10,000+ Books</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-users"></i>
                  <span>5,000+ Members</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-clock"></i>
                  <span>24/7 Access</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </section>
  );
};

export default Hero;
