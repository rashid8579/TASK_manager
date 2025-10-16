// src/components/Header.jsx
import { Link } from "react-router-dom";

function Header() {
  return (
    <header style={{ padding: "1rem", background: "#eee" }}>
      <h1>Task Manager</h1>
      <nav style={{ marginTop: "0.5rem" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
        <Link to="/profile">Profile</Link>  {/* Added link */}
      </nav>
    </header>
  );
}

export default Header;
