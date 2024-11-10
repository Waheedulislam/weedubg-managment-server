require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your frontend URL
  })
);

// Middleware
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

app.post("/confirm-payment", async (req, res) => {
  const { paymentId } = req.body; // Expecting paymentId in the body of the request

  if (!paymentId) {
    return res.status(400).json({ success: false, message: "Payment ID is required" });
  }

  // Mocking payment verification (replace with real SSLCommerz verification logic)
  const isPaymentVerified = true; // Replace this with actual verification from SSLCommerz
  if (isPaymentVerified) {
    try {
      console.log("Payment Verified");
      // const authClient = await authenticate();
      const meetLink =  'https://meet.google.com/wmh-tbcz-qho';
      console.log(meetLink)
      res.json({ meetLink });
    } catch (error) {
      console.error("Error creating Google Meet link", error);
      res.status(500).json({ error: "Error creating Google Meet link" });
    }
  } else {
    res.status(400).json({ success: false, message: "Payment verification failed" });
  }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
