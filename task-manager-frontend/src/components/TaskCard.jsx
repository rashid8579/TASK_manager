import React, { useEffect, useState, useRef } from "react";
import "./TaskCard.css";

function TaskCard({ task, onEdit, onDelete, onStatusChange, currentUser }) {
  const [animatePriority, setAnimatePriority] = useState(false);
  const prevPriorityRef = useRef(task.priority?.toLowerCase() || "low");

  const priority = (task.priority || "low").toLowerCase();
  const status = task.status || "todo";

  const priorityClass = `task-priority-${priority} ${animatePriority ? "pop-animation" : ""}`;
  const statusClass = `task-status-badge task-status-${status}`;

  const priorityIcon = { low: "🌿", medium: "⚡", high: "🔥" };
  const statusIcon = { todo: "📝", "in-progress": "⏳", done: "✅" };

  // Animate only if priority changes
  useEffect(() => {
    if (prevPriorityRef.current !== priority) {
      setAnimatePriority(true);
      const timer = setTimeout(() => setAnimatePriority(false), 300);
      prevPriorityRef.current = priority;
      return () => clearTimeout(timer);
    }
  }, [priority]);

  // Display assigned user's name if available
  const assignedUserName = task.assignedTo?.name || null;

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3 className="task-card-title">{task.title}</h3>
        <span className={`task-badge ${priorityClass}`}>
          {priorityIcon[priority]} Priority: {priority.toUpperCase()}
        </span>
      </div>

      {task.description && <p className="task-card-desc">{task.description}</p>}

      <div className="task-card-meta">
        <span className="task-info">
          Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
        </span>
        {/* Show assigned user name for all users if available */}
        {assignedUserName && (
          <span className="task-info">
            Assigned to: {assignedUserName}
          </span>
        )}
      </div>

      <div className="task-card-footer">
        <label className="task-status-label">
          {statusIcon[status]} Status:
          <select
            value={status}
            onChange={(e) => onStatusChange({ ...task, status: e.target.value })}
            className={statusClass}
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </label>

        <div className="task-actions">
          <button onClick={() => onEdit(task)} className="edit-btn">Edit</button>
          <button onClick={() => onDelete(task._id)} className="delete-btn">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
