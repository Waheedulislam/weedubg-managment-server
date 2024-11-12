const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    paymentType: { type: String },
    paymentIssuer: { type: String },
    customerName: { type: String },
    customerEmail: { type: String },
    paymentId : { type: Number},
    eventPlan: { type: String},
    planPrice: { type: String},
    status: {
      type: String,
      // required: true,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
