const express = require("express");
const { auth, roleCheck } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  getProfile,
  updateProfile,
  updateRole,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// Routes
router.get("/", auth, roleCheck(["admin", "organizer"]), getAllUsers);
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

// Admin-only route
router.get("/admin/users", auth, roleCheck(["admin"]), getAllUsers);

// Route to delete a user, admin only
router.delete("/:id", auth, roleCheck(["admin"]), deleteUser);

module.exports = router;
