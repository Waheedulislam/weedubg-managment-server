const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    event: { type: String, required: true },
    customer: { type: String, required: true },
    date: { type: String, required: true },
    tickets: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
