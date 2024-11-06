const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Auth Middleware
exports.auth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    console.log("Authorization header missing");
    return res.status(401).json({ message: "Authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      console.log("Decoded token missing ID");
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      console.log("User not found in database");
      return res.status(401).json({ message: "User not found" });
    }

    console.log("User authenticated:", req.user); // Log user info for debugging
    next();
  } catch (error) {
    console.log("JWT verification error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Role Middleware
exports.roleCheck = (requiredRoles) => (req, res, next) => {
  if (!req.user) {
    console.log("Role check failed: User not authenticated");
    return res.status(401).json({ message: "Authentication required" });
  }

  if (!requiredRoles.includes(req.user.role)) {
    console.log(`Access denied: User role ${req.user.role} not authorized`);
    return res.status(403).json({ message: "Access denied" });
  }

  console.log("Role check passed for user:", req.user.role); // Log role check status
  next();
};
