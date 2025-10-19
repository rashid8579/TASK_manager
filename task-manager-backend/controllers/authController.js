const InviteCode = require("../models/InviteCode");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Register user
exports.register = async (req, res) => {
  const { name, email, password, role, inviteCode } = req.body; // added inviteCode

  try {
    if (!name || !email || !password || !inviteCode) {
      return res.status(400).json({ msg: "Please provide all required fields including invitation code" });
    }

    // Validate invitation code for registration
    const invite = await InviteCode.findOne({ code: inviteCode, used: false });
    if (!invite) {
      return res.status(400).json({ msg: "Invalid or already used invitation code" });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ name, email, password, role: role || "user" });
    await user.save();

    // Mark invite code as used after successful registration
    invite.used = true;
    await invite.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};


// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get current logged-in user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    console.error("Get current user error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
