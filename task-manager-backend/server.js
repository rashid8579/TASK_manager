const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require('./routes/users');
dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true,
}));

app.use(express.json());

// Remove these debug logs once everything works
// console.log("Auth Routes:", authRoutes);
// console.log("Task Routes:", taskRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/users', userRoutes);
// Add a basic test route
app.get("/", (req, res) => {
  res.json({ message: "Task Manager API is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));