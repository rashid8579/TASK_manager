import React, { useState } from "react";
import axios from "axios";
import TaskForm from "./TaskForm";
import TaskCard from "./TaskCard";
import "./TaskList.css";

function TaskList({ tasks, setTasks, currentUser }) {
  const [editingTask, setEditingTask] = useState(null);
  const token = localStorage.getItem("token");

  // Update task (called from TaskForm or TaskCard)
  const handleUpdate = async (updatedTask) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${updatedTask._id}`,
        updatedTask,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) =>
        prev.map((t) => (t._id === res.data._id ? res.data : t))
      );
      setEditingTask(null);
    } catch (err) {
      console.error("Update task error:", err);
      alert("Failed to update task.");
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Delete task error:", err);
      alert("Failed to delete task.");
    }
  };

  if (!tasks || tasks.length === 0) {
    return <p style={{ textAlign: "center" }}>No tasks yet.</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) =>
        editingTask?._id === task._id ? (
          <div key={task._id} className="task-edit-form">
            <TaskForm
              task={editingTask}
              onSave={handleUpdate}
              onCancel={() => setEditingTask(null)}
              user={currentUser}
            />
          </div>
        ) : (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={setEditingTask}
            onDelete={handleDelete}
            onStatusChange={handleUpdate}
            currentUser={currentUser} // pass user info for admin
          />
        )
      )}
    </div>
  );
}

export default TaskList;
