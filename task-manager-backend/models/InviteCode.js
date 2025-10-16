// backend/models/InviteCode.js
const mongoose = require("mongoose");

const inviteCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("InviteCode", inviteCodeSchema);