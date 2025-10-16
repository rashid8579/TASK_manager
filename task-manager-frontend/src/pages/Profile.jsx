import React, { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });

  const token = localStorage.getItem("token");

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({ name: res.data.name, email: res.data.email });
      } catch (err) {
        console.error(err);
        setProfileMessage("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  // Update name/email
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/profile",
        user,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfileMessage(res.data.msg);

      // Update localStorage
      localStorage.setItem("name", user.name);
      localStorage.setItem("email", user.email);
    } catch (err) {
      console.error(err);
      setProfileMessage(err.response?.data?.msg || "Update failed");
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/change-password",
        passwords,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordMessage(res.data.msg);

      // Clear password fields
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      console.error(err);
      setPasswordMessage(err.response?.data?.msg || "Password change failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto" }}>
      <h2>Profile</h2>

      {/* Update Name/Email */}
      {profileMessage && <p style={{ color: "green" }}>{profileMessage}</p>}
      <form onSubmit={handleUpdateProfile} style={{ marginBottom: "2rem" }}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>

      {/* Change Password */}
      <h3>Change Password</h3>
      {passwordMessage && <p style={{ color: "green" }}>{passwordMessage}</p>}
      <form onSubmit={handleChangePassword}>
        <div>
          <label>Old Password:</label>
          <input
            type="password"
            value={passwords.oldPassword}
            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
            required
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            required
          />
        </div>
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}

export default Profile;
