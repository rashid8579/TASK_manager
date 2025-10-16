const express = require('express');
const router = express.Router();
const InviteCode = require("../models/InviteCode");
const authMiddleware = require("../middleware/authMiddleware");

// Middleware to verify admin user (simple example)
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: "Admin access required" });
  }
  next();
}

router.post('/generate-invite', authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const invite = new InviteCode({ code });
    await invite.save();
    res.json({ code });
  } catch (err) {
    res.status(500).json({ msg: "Error generating invitation code" });
  }
});

module.exports = router;
