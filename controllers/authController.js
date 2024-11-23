const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Correct model import

// Function to generate JWT token
const generateToken = (user) => {
  try {
    console.log("Generating token for user:", user.name);
    return jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        imgSrc: user.imgSrc,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Token generation failed");
  }
};

// User Registration
exports.register = async (req, res) => {
  const { name, email, password, role, imgSrc } = req.body;

  if (!name || !email || !password || !imgSrc) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already in use:", email);
      return res.status(400).json({ error: "Email already in use." });
    }

    // Create a new user with the hashed password
    const user = await User.create({
      name,
      email,
      password,
      role,
      imgSrc,
    });

    console.log("User created:", user.name);

    // Generate token after user creation
    const token = generateToken(user);

    // Return response with token and user info
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        imgSrc: user.imgSrc,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === 11000) {
      console.log("Email already in use:", email);
      return res.status(400).json({ error: "Email already in use." });
    }
    res.status(500).json({ error: "Server error, please try again later." });
  }
};

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Invalid email or password:", email);
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Invalid email or password:", email);
      return res.status(400).json({ error: "Invalid email or password." });
    }

    console.log("Login successful for user:", user.name);

    // Generate token with user details
    const token = generateToken(user);

    // Return response with token and user info
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        imgSrc: user.imgSrc,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error, please try again later." });
  }
};
