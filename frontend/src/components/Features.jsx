import React from "react";
import { Container, Row, Col } from 'react-bootstrap';
import "./Features.css";

const featuresData = [
  {
    icon: "fas fa-book-reader",
    title: "Extensive Library",
    description: "Access to over 50,000+ books, journals, and research papers.",
    image: "https://images.pexels.com/photos/1290141/pexels-photo-1290141.jpeg"
  },
  {
    icon: "fas fa-wifi",
    title: "High-Speed Internet",
    description: "24/7 high-speed WiFi access throughout the library.",
    image: "https://images.pexels.com/photos/7015034/pexels-photo-7015034.jpeg"
  },
  {
    icon: "fas fa-laptop",
    title: "Digital Resources",
    description: "E-books, online journals, and digital learning platforms.",
    image: "https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg"
  },
  {
    icon: "fas fa-users",
    title: "Study Groups",
    description: "Modern collaboration spaces for group studies.",
    image: "https://images.pexels.com/photos/7092613/pexels-photo-7092613.jpeg"
  },
  {
    icon: "fas fa-clock",
    title: "24/7 Access",
    description: "Round-the-clock access to study spaces and resources.",
    image: "https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg"
  },
  {
    icon: "fas fa-chalkboard-teacher",
    title: "Expert Guidance",
    description: "Professional librarians to assist with research.",
    image: "https://images.pexels.com/photos/3769714/pexels-photo-3769714.jpeg"
  },
  {
    icon: "fas fa-coffee",
    title: "Study Café",
    description: "Comfortable café area for refreshments and casual reading.",
    image: "https://images.pexels.com/photos/1813466/pexels-photo-1813466.jpeg"
  },
  {
    icon: "fas fa-print",
    title: "Print Services",
    description: "Modern printing, scanning, and photocopying facilities.",
    image: "https://images.pexels.com/photos/6457544/pexels-photo-6457544.jpeg"
  },
  {
    icon: "fas fa-universal-access",
    title: "Accessibility",
    description: "Fully accessible facilities for all users.",
    image: "https://images.pexels.com/photos/6457521/pexels-photo-6457521.jpeg"
  },
  {
    icon: "fas fa-calendar-check",
    title: "Event Spaces",
    description: "Host workshops, seminars, and literary events.",
    image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg"
  }
];

const Features = () => {
  return (
    <section className="features-section" id="features">
      <Container>
        <div className="section-header text-center">
          <h2 className="section-title">Our Features & Facilities</h2>
          <p className="section-subtitle">Discover what makes our library special</p>
        </div>
        
        <Row className="features-grid">
          {featuresData.map((feature, index) => (
            <Col key={index} lg={4} md={6} className="feature-item-wrapper">
              <div className="feature-card">
                <div className="feature-image">
                  <img src={feature.image} alt={feature.title} />
                  <div className="feature-overlay">
                    <i className={feature.icon}></i>
                  </div>
                </div>
                <div className="feature-content">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <div className="features-cta text-center">
          <h3>Ready to explore our facilities?</h3>
          <button className="btn btn-primary btn-lg">Get Started Today</button>
        </div>
      </Container>
    </section>
  );
};

export default Features;
