import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // TODO: Replace this with actual registration logic (API call)
    console.log("Registered:", formData);

    // Redirect to login page
    navigate("/");
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            required
          />
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Register</button>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
