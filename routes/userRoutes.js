const express = require("express");

const auth = require("../middleware/auth");
const {
  getAllUsers,
  getProfile,
  updateProfile,
  updateRole,
  deleteUser,
} = require("../controllers/userController");
const admin = require("../middleware/admin");
const User = require("../models/User");
const router = express.Router();

// Route to get all users
router.get("/", auth, getAllUsers);

// Route to get user profile
router.get("/profile", auth, getProfile);

// Route to update user profile
router.put("/profile", auth, updateProfile);

// Admin-only routes
router.get("/admin/users", auth, admin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

router.delete("/:id", auth, admin, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
