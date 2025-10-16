// src/pages/Home.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import FilterBar from "../components/FilterBar";
import Login from "./Login";
import Register from "./Register";
import RoleSelection from "../components/RoleSelection";
import "./Auth.css";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    priority: "",
    status: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  // Invite code UI
  const [newInviteCode, setNewInviteCode] = useState("");
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [inviteError, setInviteError] = useState("");

  // All users (admin only)
  const [allUsers, setAllUsers] = useState([]);

  const getToken = () => localStorage.getItem("token");

  // Fetch user info
  const fetchUser = async () => {
    const token = getToken();
    if (!token) {
      setIsLoggedIn(false);
      setIsLoading(false);
      return null;
    }
    try {
      const userRes = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const currentUser = userRes.data.user;
      setUser(currentUser);

      if (currentUser.role === "admin") {
        const usersRes = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllUsers(usersRes.data);
      }

      setIsLoggedIn(true);
      return currentUser;
    } catch (err) {
      setTasks([]);
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem("token");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tasks from backend with optional filters
  const fetchTasks = async (filtersObj = {}) => {
    const token = getToken();
    if (!token) {
      setTasks([]);
      return;
    }
    const params = {};
    if (filtersObj.search) params.title = filtersObj.search;
    if (filtersObj.priority) params.priority = filtersObj.priority;
    if (filtersObj.status) params.status = filtersObj.status;

    try {
      const tasksRes = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setTasks(tasksRes.data);
    } catch (err) {
      setTasks([]);
    }
  };

  // Fetch user and initial tasks on mount
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      const user = await fetchUser();
      if (user) await fetchTasks(filters);
      setIsLoading(false);
    };
    initialize();
    // eslint-disable-next-line
  }, []);

  // Refetch tasks from backend when filters change (and logged in)
  useEffect(() => {
    if (isLoggedIn) {
      fetchTasks(filters);
      setCurrentPage(1); // Reset to page 1 after filter change
    }
    // eslint-disable-next-line
  }, [filters, isLoggedIn]);

  const handleAddTask = async (taskData) => {
    try {
      const token = getToken();
      await axios.post("http://localhost:5000/api/tasks", taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchTasks(filters);
    } catch (err) {
      alert("Failed to add task.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setTasks([]);
    setUser(null);
    setShowRegister(false);
    setSelectedRole("");
    setShowAuth(false);
    window.location.reload();
  };

  // Invite code generation function for admin
  const generateInviteCode = async () => {
    setLoadingInvite(true);
    setInviteError("");
    try {
      const token = getToken();
      const res = await axios.post(
        "http://localhost:5000/api/admin/generate-invite",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewInviteCode(res.data.code);
    } catch (err) {
      setInviteError("Failed to generate invite code.");
    } finally {
      setLoadingInvite(false);
    }
  };

  // Role selection handlers
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowAuth(true);
  };
  const goBackToRoleSelection = () => {
    setShowAuth(false);
    setSelectedRole("");
    setShowRegister(false);
  };

  // Pagination logic for All Tasks
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  if (isLoading) {
    return (
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    if (!showAuth) {
      return <RoleSelection onRoleSelect={handleRoleSelect} />;
    }

    if (selectedRole === "admin") {
      return (
        <div className="auth-container">
          <Login
            onLogin={async () => {
              await fetchUser();
              await fetchTasks(filters);
            }}
            switchToRegister={() => {}}
            selectedRole={selectedRole}
            goBackToRoleSelection={goBackToRoleSelection}
          />
        </div>
      );
    }

    return (
      <div className="auth-container">
        {showRegister ? (
          <Register
            onRegister={async () => {
              setShowRegister(false);
              await fetchUser();
              await fetchTasks(filters);
            }}
            switchToLogin={() => setShowRegister(false)}
            selectedRole={selectedRole}
            goBackToRoleSelection={goBackToRoleSelection}
          />
        ) : (
          <Login
            onLogin={async () => {
              await fetchUser();
              await fetchTasks(filters);
            }}
            switchToRegister={() => setShowRegister(true)}
            selectedRole={selectedRole}
            goBackToRoleSelection={goBackToRoleSelection}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem", height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          {user && <h2>Welcome, {user.name}!</h2>}
          {user?.role === "admin" && <p style={{ fontWeight: "bold" }}>You are an Admin</p>}
        </div>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#dc2626",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            borderRadius: "6px",
          }}
        >
          Logout
        </button>
      </div>

      {/* Admin Invite Code Generator */}
      {user?.role === "admin" && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          background: "#222",
          color: "#fff",
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          margin: "0.75rem 0"
        }}>
          <span style={{ fontWeight: "bold" }}>Generate Invite Code:</span>
          <button onClick={generateInviteCode} disabled={loadingInvite} style={{
            padding: "0.4rem 1rem",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}>
            {loadingInvite ? "Generating..." : "Generate"}
          </button>
          {newInviteCode && (
            <span style={{ marginLeft: "0.5rem", color: "#4ade80", fontWeight: "bold" }}>
              {newInviteCode}
            </span>
          )}
          {inviteError && (
            <span style={{ color: "red", marginLeft: "0.5rem" }}>{inviteError}</span>
          )}
        </div>
      )}

      {/* Show Task Form only for Admin */}
      {user?.role === "admin" && <TaskForm onSave={handleAddTask} user={user} allUsers={allUsers} />}

      {/* Show FilterBar for everyone */}
      <FilterBar onFilter={setFilters} />

      {/* All Tasks Section with Pagination */}
      <div style={{ padding: "1rem 0" }}>
        <h3>All Tasks</h3>
        <TaskList tasks={currentTasks} setTasks={setTasks} currentUser={user} />
      </div>

      {/* Pagination controls for All Tasks */}
      {totalPages > 1 && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "0.5rem",
          gap: "0.5rem",
        }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #ccc",
              backgroundColor: currentPage === 1 ? "#eee" : "#3498db",
              color: currentPage === 1 ? "#555" : "white",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              borderRadius: "6px",
            }}
          >
            Previous
          </button>
          <span style={{ alignSelf: "center" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #ccc",
              backgroundColor: currentPage === totalPages ? "#eee" : "#3498db",
              color: currentPage === totalPages ? "#555" : "white",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              borderRadius: "6px",
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
export default Home;
