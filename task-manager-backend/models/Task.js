const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
    dueDate: { type: Date },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

     completedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // new
    completedAt: { type: Date }, // new
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
