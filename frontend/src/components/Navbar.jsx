import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import "./Navbar.css";  // ✅ Ensure custom styles

const NavigationBar = () => {
  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand href="/" className="brand-logo">
          SuccessLibrary
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>  {/* ✅ Scroll to #features */}
            <Nav.Link href="#about">About</Nav.Link>        {/* ✅ Scroll to #about */}
            <Nav.Link href="/login">Login</Nav.Link>
            <Button href="/register" className="btn-custom">Sign Up</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
