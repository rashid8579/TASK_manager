// src/pages/Login.jsx
import { useState } from "react";
import axios from "axios";
import "./Auth.css";

const API = import.meta.env.VITE_API_URL;

function Login({ onLogin, switchToRegister, selectedRole, goBackToRoleSelection }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ⬅️ new loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // ⬅️ start loading

    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email,
        password,
      });

      // Check user's role
      const userRole = res.data.user.role;

      if (userRole !== selectedRole) {
        setError("INVALID CREDENTIAL: You can't log in as this role with these credentials.");
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        setLoading(false);
        return;
      }

      // Store token and name
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.user.name);

      // ✅ Call onLogin after storing token (keeps logic same)
      await onLogin(); // make sure parent can fetch tasks in parallel
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Login failed. Please check credentials.");
    } finally {
      setLoading(false); // ⬅️ stop loading
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
            {selectedRole === "admin" ? "🔐 Admin Login" : "👤 User Login"}
          </h2>
        </div>

        {error && <p className="auth-error">{error}</p>}

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

        <button
          type="submit"
          className="auth-button"
          disabled={loading} // ⬅️ disable button while logging in
        >
          {loading
            ? `Logging in as ${selectedRole === "admin" ? "Admin" : "User"}...`
            : `Login as ${selectedRole === "admin" ? "Admin" : "User"}`}
        </button>

        {selectedRole !== "admin" && (
          <p className="auth-switch">
            Don't have an account?
            <button
              type="button"
              onClick={() => {
                switchToRegister();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Register
            </button>
          </p>
        )}
      </form>
    </div>
  );
}

export default Login;
