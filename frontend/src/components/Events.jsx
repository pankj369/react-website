import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import "./Events.css";

const eventsData = [
  {
    id: 1,
    title: "Book Reading Session",
    date: "March 10, 2025",
    time: "4:00 PM - 6:00 PM",
    description: "Join us for an engaging book reading session with renowned authors.",
    image: "https://source.unsplash.com/400x250/?books,library",
    location: "Main Library Hall",
    seats: 50,
    speaker: "Dr. Sarah Johnson"
  },
  {
    id: 2,
    title: "Coding Bootcamp",
    date: "March 15, 2025",
    time: "10:00 AM - 3:00 PM",
    description: "A hands-on workshop on JavaScript, React, and backend development.",
    image: "https://source.unsplash.com/400x250/?coding,technology",
    location: "Tech Lab",
    seats: 30,
    speaker: "Prof. Michael Chen"
  },
  {
    id: 3,
    title: "Career Guidance Seminar",
    date: "March 20, 2025",
    time: "1:00 PM - 4:00 PM",
    description: "Get career advice from industry experts and plan your future effectively.",
    image: "https://source.unsplash.com/400x250/?seminar,career",
    location: "Conference Room",
    seats: 100,
    speaker: "Ms. Emily Parker"
  },
];

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

const handleRegistration = async (e) => {
    console.log("Registration initiated with data:", { event_id: selectedEvent.id, name, email, phone });

    e.preventDefault();
    // Send registration data to the backend API
    const response = await fetch('/api/register', { 
        // Check if the API endpoint is reachable

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event_id: selectedEvent.id, name, email, phone }),

    });


    if (response.ok) { 
        console.log("Registration successful:", await response.json());

      alert("Registration successful!");
      setShowModal(false);
      setName("");
      setEmail("");
      setPhone("");
    } else {
      alert("Registration failed. Please try again."); 
      console.error("Registration error:", response.statusText);

    }
  };

  return (
    <section className="events-section" id="events">
      <Container>
        <div className="section-header text-center">
          <h2 className="section-title">Upcoming Events</h2>
          <p className="section-subtitle">Join us for these exciting events</p>
        </div>

        <Row className="events-grid">
          {eventsData.map((event) => (
            <Col md={4} key={event.id} className="mb-4">
              <Card className="event-card">
                <div className="event-image">
                  <Card.Img variant="top" src={event.image} alt={event.title} />
                  <div className="event-overlay">
                    <Button 
                      variant="light" 
                      className="details-btn"
                      onClick={() => handleEventClick(event)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
                <Card.Body>
                  <div className="event-date">
                    <i className="far fa-calendar-alt"></i>
                    <span>{event.date}</span>
                  </div>
                  <Card.Title>{event.title}</Card.Title>
                  <Card.Text>{event.description}</Card.Text>
                  <div className="event-info">
                    <span><i className="far fa-clock"></i> {event.time}</span>
                    <span><i className="fas fa-map-marker-alt"></i> {event.location}</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          {selectedEvent && (
            <>
              <Modal.Header closeButton>
                <Modal.Title>{selectedEvent.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <img 
                  src={selectedEvent.image} 
                  alt={selectedEvent.title} 
                  className="modal-image"
                />
                <div className="event-details">
                  <p className="event-description">{selectedEvent.description}</p>
                  <div className="event-meta">
                    <p><i className="far fa-calendar-alt"></i> {selectedEvent.date}</p>
                    <p><i className="far fa-clock"></i> {selectedEvent.time}</p>
                    <p><i className="fas fa-map-marker-alt"></i> {selectedEvent.location}</p>
                    <p><i className="fas fa-user-tie"></i> Speaker: {selectedEvent.speaker}</p>
                    <p><i className="fas fa-users"></i> Available Seats: {selectedEvent.seats}</p>
                  </div>
                </div>
                <form onSubmit={handleRegistration}>
                  <input 
                    type="text" 
                    placeholder="Enter Your Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                  />
                  <input 
                    type="email" 
                    placeholder="Enter Your Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" 
                    title="Please enter a valid email address." 
                  />
                   <input 
                    type="number" 
                    placeholder="Enter Your Phone Number" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required 
                  />

                  <Button type="submit" variant="primary">Register Now</Button>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </>
          )}
        </Modal>
      </Container>
    </section>
  );
};

export default Events;
