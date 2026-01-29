// src/pages/user/UserRegister.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/register.css";

const UserRegister = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="register-page">
      {/* LEFT */}
      <div className="register-left animate-image"></div>

      {/* RIGHT */}
      <div className="register-right">
        <div className="register-card animate-card">
          <h2>Create Account</h2>
          <p>Join women empowerment community</p>

          <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Full Name" onChange={handleChange} />
            <input name="email" placeholder="Email Address" onChange={handleChange} />
            <input name="phone" placeholder="Phone Number" onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />

            <button className="register-btn">Create Account</button>
          </form>

          <p className="register-bottom">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
