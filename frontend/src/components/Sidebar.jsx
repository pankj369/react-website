import React from 'react';
import { Offcanvas, Nav } from 'react-bootstrap';

const Sidebar = ({ show, handleClose }) => {
  return (
    <Offcanvas show={show} onHide={handleClose} placement="start">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>SuccessLibrary</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Nav className="flex-column">
          <Nav.Link href="/" onClick={handleClose}>
            <i className="fas fa-home me-2"></i> Home
          </Nav.Link>
          <Nav.Link href="#features" onClick={handleClose}>
            <i className="fas fa-star me-2"></i> Features
          </Nav.Link>
          <Nav.Link href="#about" onClick={handleClose}>
            <i className="fas fa-info-circle me-2"></i> About
          </Nav.Link>
          <Nav.Link href="/login" onClick={handleClose}>
            <i className="fas fa-sign-in-alt me-2"></i> Login
          </Nav.Link>
          <Nav.Link href="/register" onClick={handleClose}>
            <i className="fas fa-user-plus me-2"></i> Sign Up
          </Nav.Link>
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Sidebar;