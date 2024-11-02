// const jwt = require("jsonwebtoken");
// const User = require("../models/User"); // Correct model import

// // Function to generate JWT token
// const generateToken = (user) => {
//   return jwt.sign(
//     {
//       id: user._id,
//       role: user.role,
//       name: user.name, // Include name in the token
//       email: user.email, // Include email in the token
//     },
//     process.env.JWT_SECRET,
//     {
//       expiresIn: "7d",
//     }
//   );
// };

// // User Registration
// exports.register = async (req, res) => {
//   const { name, email, password, role } = req.body;
//   try {
//     // Check if the email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "Email already in use." });
//     }

//     // Create a new user with the hashed password
//     const user = await User.create({
//       name,
//       email,
//       password,
//       role,
//     });
//     console.log("New user created:", user); // Log created user

//     // Generate token after user creation
//     const token = generateToken(user);

//     // Return response with token and user info
//     res.status(201).json({
//       message: "User registered successfully",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       }, // Include email in the response
//     });
//   } catch (error) {
//     console.error("Registration error:", error); // Log error details for debugging
//     if (error.code === 11000) {
//       return res.status(400).json({ error: "Email already in use." });
//     }
//     res.status(500).json({ error: "Server error, please try again later." });
//   }
// };

// // User Login
// // exports.login = async (req, res) => {
// //   const { email, password } = req.body;
// //   try {
// //     const user = await User.findOne({ email });
// //     if (!user) {
// //       return res.status(400).json({ message: "Invalid email or password" });
// //     }

// //     const isMatch = await user.comparePassword(password);
// //     if (!isMatch) {
// //       return res.status(400).json({ message: "Invalid email or password" });
// //     }

// //     // Generate token with all required user details
// //     const token = generateToken(user);

// //     // Return response with token and user info
// //     res.json({
// //       token,
// //       user: {
// //         id: user._id,
// //         name: user.name,
// //         email: user.email,
// //         role: user.role,
// //       }, // Include email in the response
// //     });
// //   } catch (error) {
// //     console.error("Login error:", error); // Log error details for debugging
// //     res.status(500).json({ message: "Server error, please try again later." });
// //   }
// // };

// // exports.login = async (req, res) => {
// //   console.log("Received request body:", req.body); // Log the request body
// //   const { email, password } = req.body;

// //   try {
// //     const user = await User.findOne({ email });
// //     if (!user) {
// //       return res.status(400).json({ message: "Invalid email or password" });
// //     }

// //     const isMatch = await user.comparePassword(password);
// //     if (!isMatch) {
// //       return res.status(400).json({ message: "Invalid email or password" });
// //     }

// //     const payload = { id: user.id, role: user.role };

// //     jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
// //       if (err) {
// //         console.error("JWT signing error:", err);
// //         return res.status(500).json({ message: "Token generation error" });
// //       }
// //       res.json({ token });
// //     });
// //   } catch (error) {
// //     console.error("Login error:", error); // Log error details for debugging
// //     res.status(500).json({ message: "Server error, please try again later." });
// //   }
// // };

// // User Login

// // User Login

// // User Login
// // User Login
// exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     const payload = {
//       id: user.id,
//       role: user.role,
//       name: user.name, // Include name in the token
//       email: user.email, // Include email in the token
//     };

//     const token = generateToken(user); // Use the updated token generation function

//     res.json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         role: user.role,
//         email: user.email,
//       }, // Return user details
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error, please try again later." });
//   }
// };

const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Correct model import

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      name: user.name, // Include name in the token
      email: user.email, // Include email in the token
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// User Registration
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    // Create a new user with the hashed password
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    console.log("New user created:", user); // Log created user

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
      }, // Include email in the response
    });
  } catch (error) {
    console.error("Registration error:", error); // Log error details for debugging
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already in use." });
    }
    res.status(500).json({ error: "Server error, please try again later." });
  }
};

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("Attempting to login with email:", email); // Log the email for debugging
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found with email:", email); // Log if user is not found
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Password mismatch for email:", email); // Log if password does not match
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token with all required user details
    const token = generateToken(user);
    console.log("Generated token for user:", user.name); // Log the token for debugging

    // Return response with token and user info
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }, // Include email in the response
    });
    console.log("Login successful for user:", user.name); // Log successful login
  } catch (error) {
    console.error("Login error:", error); // Log error details for debugging
    res.status(500).json({ message: "Server error, please try again later." });
  }
};
