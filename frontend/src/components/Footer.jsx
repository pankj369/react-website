import React, { useState } from "react";
import { Link } from 'react-router-dom';

import "./Footer.css";

function Footer() {
  const [mostLovedVisible, setMostLovedVisible] = useState(true);
  const [categoriesVisible, setCategoriesVisible] = useState(true);

  const toggleVisibility = (section) => {
    if (section === "mostLoved") {
      setMostLovedVisible(!mostLovedVisible);
    } else if (section === "categories") {
      setCategoriesVisible(!categoriesVisible);
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-row">
          <div className="footer-col">
            <h4>About company</h4>
            <p>
              Take your projects to the next level with our premium collections
              of ready-to-use products at your fingertips.
            </p>
            <p>
              <strong>Email:</strong> support@librarywebsite.com
            </p>
          </div>

          <div className="footer-col">
            <h4 onClick={() => toggleVisibility("mostLoved")}>Most loved</h4>
            {mostLovedVisible && (
              <ul>
                <li>
                  <a href="#">Book Recommendation Tool</a>
                </li>
                <li>
                  <a href="#">E-book Reader Integration</a>
                </li>
                <li>
                  <a href="#">Online Library Management</a>
                </li>
                <li>
                  <a href="#">Virtual Book Clubs</a>
                </li>
              </ul>
            )}
          </div>

          <div className="footer-col">
            <h4 onClick={() => toggleVisibility("categories")}>Categories</h4>
            {categoriesVisible && (
              <ul>
                <li>
                  <a href="#">E-books</a>
                </li>
                <li>
                  <a href="#">Magazines</a>
                </li>
                <li>
                  <a href="#">Research Papers</a>
                </li>
                <li>
                  <a href="#">Audiobooks</a>
                </li>
              </ul>
            )}
          </div>

          <div className="footer-col">
            <h4>Customer support</h4>
            <ul>
              <li>
                  <Link to="/about">About Us</Link>
              </li>
              <li>
                  <Link to="/support">Support</Link>
              </li>
              <li>
                  <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                  <Link to="/terms-and-conditions">Terms & Conditions</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Library Website. All rights reserved.</p>
          <div className="social-links">
            <Link to="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </Link>
            <Link to="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </Link>
            <Link to="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </Link>
            <Link to="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
