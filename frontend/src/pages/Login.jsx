import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Left Side - Image Section */}
        <div className="login-image">
          <img src="/assets/login-image.jpg" alt="Library Login" />
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form">
          <h2>Welcome Back</h2>
          <p>Login to access your account</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <div className="register-link">
            <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
