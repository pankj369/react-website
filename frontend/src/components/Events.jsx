import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./Events.css"; // ✅ Import custom styles

const eventsData = [
  {
    id: 1,
    title: "Book Reading Session",
    date: "March 10, 2025",
    time: "4:00 PM - 6:00 PM",
    description: "Join us for an engaging book reading session with renowned authors.",
    image: "https://source.unsplash.com/400x250/?books,library",
  },
  {
    id: 2,
    title: "Coding Bootcamp",
    date: "March 15, 2025",
    time: "10:00 AM - 3:00 PM",
    description: "A hands-on workshop on JavaScript, React, and backend development.",
    image: "https://source.unsplash.com/400x250/?coding,technology",
  },
  {
    id: 3,
    title: "Career Guidance Seminar",
    date: "March 20, 2025",
    time: "1:00 PM - 4:00 PM",
    description: "Get career advice from industry experts and plan your future effectively.",
    image: "https://source.unsplash.com/400x250/?seminar,career",
  },
];

const Events = () => {
  return (
    <Container className="events-container py-5">
      <h2 className="text-center mb-4">Upcoming Events</h2>
      <Row>
        {eventsData.map((event) => (
          <Col md={4} key={event.id} className="mb-4">
            <Card className="event-card">
              <Card.Img variant="top" src={event.image} alt={event.title} />
              <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {event.date} | {event.time}
                </Card.Subtitle>
                <Card.Text>{event.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Events;
