import React from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

function Hero() {
  const navigate = useNavigate(); // ✅ Use React Router for navigation

  return (
    <section className="hero" id="heroSection">
      <div className="hero-background"></div>
      <div className="hero-content">
        <h1 className="hero-title">Welcome to LibrarySpace</h1>
        <p className="hero-description">
          Your perfect study spot with all the resources you need.
          <br /> Explore an endless world of books, learning resources, and
          study spaces.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => navigate("/catalog")}>
            Browse the Catalog
          </button>
          <button
            className="btn-secondary"
            onClick={() =>
              alert("LibrarySpace offers books, study rooms, and more!")
            }
          >
            Learn More
          </button>
        </div>
      </div>
     
    </section>
  );
}

export default Hero;
