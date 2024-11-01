const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Auth Middleware
exports.auth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Role Middleware
exports.roleCheck = (requiredRoles) => (req, res, next) => {
  if (!requiredRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
