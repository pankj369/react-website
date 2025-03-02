import React, { useState } from "react";
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
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Support</a>
              </li>
              <li>
                <a href="Privacy policy.html">Privacy Policy</a>
              </li>
              <li>
                <a href="Terms and condition.html">Terms & Conditions</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Library Website. All rights reserved.</p>
          <div className="social-links">
            <a href="#">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
