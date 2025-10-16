// src/pages/Register.jsx
import { useState } from "react";
import axios from "axios";
import "./Auth.css";

function Register({ onRegister, switchToLogin, selectedRole, goBackToRoleSelection }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");  // New state for invitation code
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        inviteCode,  // Include invite code in API request
      });

      // Save name (optional)
      localStorage.setItem("name", res.data.user.name);

      // Notify user
      alert("Registration successful! Please log in.");

      // Call parent handler
      onRegister();

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setInviteCode(""); // Reset new field
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form auth-form-active">

        <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
          <button
            type="button"
            onClick={goBackToRoleSelection}
            style={{
              background: "#e0e7ef",
              border: "1px solid #888",
              borderRadius: "50%",
              width: "38px",
              height: "38px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              cursor: "pointer",
              marginRight: "0.8rem",
              color: "#3498db"
            }}
            aria-label="Back"
            title="Back to Role Selection"
          >
            ←
          </button>
          <h2 className="auth-title">
            {selectedRole === "admin" ? "🔐 Admin Register" : "👤 User Register"}
          </h2>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <div className="auth-input-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="auth-input"
          />
        </div>

        <div className="auth-input-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
        </div>

        <div className="auth-input-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
        </div>

        {/* New Invitation Code input */}
        <div className="auth-input-group">
          <label>Invitation Code:</label>
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            required
            className="auth-input"
            placeholder="Enter invitation code"
          />
        </div>

        <button type="submit" className="auth-button">
          Register as {selectedRole === "admin" ? "Admin" : "User"}
        </button>

        <p className="auth-switch">
          Already have an account?
          <button
            type="button"
            onClick={() => {
              switchToLogin();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}

export default Register;
