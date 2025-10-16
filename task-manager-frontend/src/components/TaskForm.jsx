import React, { useState, useEffect } from "react";
import "./TaskForm.css";

function TaskForm({ task, onSave, onCancel, user, allUsers }) {
  const getAssignedId = (task, allUsers, user) => {
    if (task?.assignedTo?._id) return task.assignedTo._id;
    if (typeof task?.assignedTo === "string") return task.assignedTo;
    if (user?.role === "admin" && allUsers?.length > 0) return allUsers[0]._id;
    return "";
  };

  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(task?.priority || "");
  const [status, setStatus] = useState(task?.status || "");
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.substring(0, 10) : "");
  const [assignedUser, setAssignedUser] = useState(getAssignedId(task, allUsers, user));

  useEffect(() => {
    setTitle(task?.title || "");
    setDescription(task?.description || "");
    setPriority(task?.priority || "");
    setStatus(task?.status || "");
    setDueDate(task?.dueDate ? task.dueDate.substring(0, 10) : "");
    setAssignedUser(getAssignedId(task, allUsers, user));
  }, [task, allUsers, user]);

  // Key line: today's date as yyyy-mm-dd for min constraint
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      dueDate: dueDate || null,
    };

    if (user?.role === "admin" && !task) {
      payload.assignedTo = assignedUser;
    }

    if (task && task._id) onSave({ ...task, ...payload });
    else onSave(payload);

    if (!task) {
      setTitle("");
      setDescription("");
      setPriority("");
      setStatus("");
      setDueDate("");
      setAssignedUser(user?.role === "admin" && allUsers?.length > 0 ? allUsers[0]._id : "");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="" disabled hidden>
          Priority
        </option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="" disabled hidden>
          Status
        </option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <input
        type="date"
        value={dueDate}
        min={today}
        onChange={(e) => setDueDate(e.target.value)}
      />
      {user?.role === "admin" && !task && allUsers?.length > 0 && (
        <select value={assignedUser} onChange={(e) => setAssignedUser(e.target.value)} required>
          <option value="" disabled>
            Select user to assign
          </option>
          {allUsers.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
      )}
      <button type="submit">{task ? "Update Task" : "Add Task"}</button>
      {task && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
}

export default TaskForm;
