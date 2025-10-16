const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Routes
router.post("/register", register);
router.post("/login", login);

// New route to get current logged-in user
router.get("/me", authMiddleware, getMe);

module.exports = router;
