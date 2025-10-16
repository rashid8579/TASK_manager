// src/components/RoleSelection.jsx
import { useState } from "react";
import "../pages/Auth.css"; // ✅ Updated path to reach Auth.css in pages folder

function RoleSelection({ onRoleSelect }) {
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    onRoleSelect(role);
  };

  return (
    <div className="auth-container">
      <div className="auth-form auth-form-active">
        <h2 className="auth-title">Select Your Role</h2>
        <p style={{ textAlign: "center", marginBottom: "2rem", color: "#666" }}>
          Choose how you want to access the Task Manager
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <button
            type="button"
            onClick={() => handleRoleSelect("user")}
            className="auth-button"
            style={{
              backgroundColor: "#3498db",
              padding: "1rem",
              fontSize: "1.1rem",
              marginBottom: "0.5rem"
            }}
          >
            👤 User Login
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect("admin")}
            className="auth-button"
            style={{
              backgroundColor: "#e74c3c",
              padding: "1rem",
              fontSize: "1.1rem"
            }}
          >
            🔐 Admin Login
          </button>
        </div>

        <div style={{ marginTop: "2rem", textAlign: "center", color: "#666", fontSize: "0.9rem" }}>
          <p>User: Create and manage your own tasks</p>
          <p>Admin: View and manage all tasks</p>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;
