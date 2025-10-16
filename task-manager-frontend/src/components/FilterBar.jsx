// src/components/FilterBar.jsx
import React, { useEffect, useState } from "react";
import "./FilterBar.css";

function FilterBar({ onFilter }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  // Call onFilter whenever any filter changes
  useEffect(() => {
    if (typeof onFilter === "function") {
      onFilter({ search: search.trim(), status, priority });
    }
  }, [search, status, priority, onFilter]);

  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="filter-input"
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="filter-select"
      >
        <option value="">All Status</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="filter-select"
      >
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  );
}

export default FilterBar;
