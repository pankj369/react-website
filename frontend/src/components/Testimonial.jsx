import React, { useState, useEffect } from "react";
import "./Testimonial.css";

const testimonials = [
  {
    name: "Rahul Sharma",
    review:
      "The library has an amazing collection of books and a peaceful environment. It has helped me stay focused during my exam preparations.",
    designation: "Engineering Student",
    image: "/assets/rahul.jpg",
    rating: 5,
  },
  {
    name: "Priya Verma",
    review:
      "I love the digital resources available here. The free Wi-Fi and e-books have been a lifesaver for my research work!",
    designation: "PhD Scholar",
    image: "/assets/priya.jpg",
    rating: 4,
  },
  {
    name: "Amit Tiwari",
    review:
      "The student dashboard feature is fantastic. It helps me track my borrowed books and study schedule efficiently.",
    designation: "MBA Student",
    image: "/assets/amit.jpg",
    rating: 5,
  },
  {
    name: "Neha Gupta",
    review:
      "A perfect place for students! The group study rooms and reference materials are very useful.",
    designation: "Medical Student",
    image: "/assets/neha.jpg",
    rating: 4.5,
  },
];

const Testimonial = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000); // Auto-slide every 5 seconds

    return () => clearInterval(interval);
  }, [index]);

  const prevTestimonial = () => {
    setIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const nextTestimonial = () => {
    setIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="testimonial">
      <h2 className="section-title">What Our Students Say</h2>
      <div className="testimonial-container">
        <button className="nav-btn left" onClick={prevTestimonial}>
          ❮
        </button>
        <div className="testimonial-card fade-in">
          <img
            src={testimonials[index].image}
            alt={testimonials[index].name}
            className="profile-img"
          />
          <p className="review">"{testimonials[index].review}"</p>
          <h3 className="name">{testimonials[index].name}</h3>
          <span className="designation">{testimonials[index].designation}</span>
          <div className="rating">
            {"★".repeat(Math.floor(testimonials[index].rating))}{" "}
            {testimonials[index].rating % 1 !== 0 ? "☆" : ""}
          </div>
        </div>
        <button className="nav-btn right" onClick={nextTestimonial}>
          ❯
        </button>
      </div>
    </section>
  );
};

export default Testimonial;
