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

// Admin-only routes
router.put("/role/:id", auth, roleCheck(["admin"]), updateRole); // Route to update role
router.delete("/:id", auth, roleCheck(["admin"]), deleteUser); // Route to delete user

module.exports = router;
