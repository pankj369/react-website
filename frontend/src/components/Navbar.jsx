import React, { useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import Sidebar from "./Sidebar";
import "./Navbar.css";

const NavigationBar = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSidebarClose = () => setShowSidebar(false);
  const handleSidebarShow = () => setShowSidebar(true);

  return (
    <>
      <Navbar expand="lg" className="navbar-custom" fixed="top">
        <Container>
          <Navbar.Brand href="/" className="brand-logo">
            <i className="fas fa-book-reader me-2"></i>
            SuccessLibrary
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={handleSidebarShow}
          />
          <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-block">
            <Nav className="ms-auto align-items-center">
              <Nav.Link href="#features" className="nav-link-custom">
                <i className="fas fa-star me-1"></i> Features
              </Nav.Link>
              <Nav.Link href="#events" className="nav-link-custom">
                <i className="fas fa-calendar-alt me-1"></i> Upcoming Events
              </Nav.Link>
              <Nav.Link href="#about" className="nav-link-custom">
                <i className="fas fa-info-circle me-1"></i> About
              </Nav.Link>
              <Nav.Link href="/login" className="nav-link-custom">
                <i className="fas fa-sign-in-alt me-1"></i> Login
              </Nav.Link>
              <Button href="/register" className="btn-custom ms-2">
                <i className="fas fa-user-plus me-1"></i> Sign Up
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Sidebar show={showSidebar} handleClose={handleSidebarClose} />
    </>
  );
};

export default NavigationBar;
