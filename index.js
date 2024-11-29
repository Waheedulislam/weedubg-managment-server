require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "https://weedingpro.netlify.app",
    // origin: "http://localhost:5173", // Allow requests from your frontend URL
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
app.use("/api", reservationRoutes);
app.use("/api", meetingRoutes);
app.use("/api/payment-success", paymentRoutes);



// app.post('/payment-success',async(req,res)=>{

//   try {
//     const successData = req.body;
//     console.log("Success data from SSLCommerz:", successData);

//     // Check if the payment status is valid
//     if (successData.status !== "VALID") {
//         return res.status(401).json({ message: "Unauthorized Payment, Invalid Payment" });
//     }

//     // Log transaction ID for verification
//     const transactionId = successData.tran_id;
//     // console.log("Transaction ID:", transactionId);

//     // Update the specific payment status in the database
//     const query = { "userPayment.paymentId": transactionId };
//     const update = {
//         $set: {
//             "userPayment.$.status": "Success", // Update the specific payment status
//             "userPayment.$.paymentType": successData.card_brand,
//             "userPayment.$.paymentIssuer": successData.card_issuer,
//         },
//     };

//     const result = await Payment.updateOne(query, update);
//     console.log("Database update result:", result);

//     // Check if the payment status update was successful
//     if (result.modifiedCount === 1) {
//         console.log("Payment status successfully updated.");
//         return res.redirect("http://localhost:5173/payment-success");
//          // Redirect to the /about page after success
//     } else {
//         console.error("Payment status update failed.");
//         return res.status(400).json({ message: "Payment update failed" });
//     }
// } catch (error) {
//     console.error("Error updating payment status:", error);
//     return res.status(500).json({ message: "Internal server error" });
// }

// })



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
