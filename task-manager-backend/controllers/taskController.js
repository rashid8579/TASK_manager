const Task = require("../models/Task");

// Get all tasks for authenticated user -- now supports filtering!
exports.getTasks = async (req, res) => {
  try {
    // Get filters from query params
    const { title, priority, status } = req.query;
    let query = {};

    if (req.user.role === "admin") {
      // Admin can see all tasks, with optional filters
      if (title) query.title = { $regex: title, $options: "i" };
      if (priority) query.priority = priority;
      if (status) query.status = status;
    } else {
      // User only sees their assigned tasks, with optional filters
      query.assignedTo = req.user.id;
      if (title) query.title = { $regex: title, $options: "i" };
      if (priority) query.priority = priority;
      if (status) query.status = status;
    }

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .populate("assignedTo", "name email")
      .populate("completedBy", "name");
    res.json(tasks);
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


// Create a new task (admin only)
exports.createTask = async (req, res) => {
  const { title, description, priority, dueDate, status, assignedTo } = req.body;
  try {
    if (!title) return res.status(400).json({ msg: "Task title is required" });
    if (req.user.role !== "admin") return res.status(403).json({ msg: "Only admin can create tasks" });
    if (!assignedTo) return res.status(400).json({ msg: "assignedTo (user ID) is required" });

    const task = new Task({
      title,
      description: description || "",
      priority: priority || "medium",
      status: status || "todo",
      dueDate: dueDate || null,
      assignedTo,
    });

    await task.save();
    const populatedTask = await task.populate("assignedTo", "name email");
    res.status(201).json(populatedTask);
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


// Get single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("completedBy", "name");

    if (!task) return res.status(404).json({ msg: "Task not found" });
    if (task.assignedTo._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized to view this task" });
    }

    res.json(task);
  } catch (err) {
    console.error("Get task error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (task.assignedTo.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized to delete this task" });
    }

    await task.deleteOne();
    res.json({ msg: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


// Update a task
exports.updateTask = async (req, res) => {
  const { title, description, priority, status, dueDate, assignedTo } = req.body;

  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (task.assignedTo.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized to update this task" });
    }

    if (status && !["todo", "in-progress", "done"].includes(status))
      return res.status(400).json({ msg: "Invalid status" });
    if (priority && !["low", "medium", "high"].includes(priority))
      return res.status(400).json({ msg: "Invalid priority" });

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    // Update assignedTo only if provided
    if (assignedTo !== undefined) {
      task.assignedTo = assignedTo;
    }

    if (status !== undefined) {
      task.status = status;
      if (status === "done") {
        task.completedBy = req.user.id;
        task.completedAt = new Date();
      } else {
        task.completedBy = null;
        task.completedAt = null;
      }
    }

    await task.save();

    // Populate assignedTo and completedBy before response
    task = await task.populate("assignedTo", "name email");
    task = await task.populate("completedBy", "name");

    res.json(task);
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
