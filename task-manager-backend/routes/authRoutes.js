const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { register, login, getMe, changePassword } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

// =============================
// Auth Routes
// =============================

// Register new user
router.post("/register", register);

// Login existing user
router.post("/login", login);

// Get logged-in user info
router.get("/me", authMiddleware, getMe);

// Change password route
router.post("/change-password", authMiddleware, changePassword);

// =============================
// Temporary route: Create first admin
// =============================
router.get("/create-admin", async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(400).json({ msg: "Admin already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("Rashid8578", saltRounds);

    const admin = new User({
      name: "Md Rashid Raza",
      email: "rashidkhan@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    res.status(201).json({
      msg: "Admin created successfully!",
      admin: { email: admin.email },
    });
  } catch (err) {
    console.error("Error creating admin:", err);
    res.status(500).json({
      msg: "Server error while creating admin",
      error: err.message,
    });
  }
});

module.exports = router;
