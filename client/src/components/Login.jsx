// src/components/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    role: "user",
  });

  const handleLogin = (e) => {
    e.preventDefault();

    // TODO: Replace console.log with real authentication call
    console.log("Logging in with:", loginData);

    // Redirect based on role
    if (loginData.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={loginData.username}
            onChange={(e) =>
              setLoginData({ ...loginData, username: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            required
          />
          <select
            value={loginData.role}
            onChange={(e) =>
              setLoginData({ ...loginData, role: e.target.value })
            }
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Login</button>
        </form>
        <p className="register-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
