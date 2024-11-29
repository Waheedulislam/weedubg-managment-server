const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    date: { type: String },
    event: { type: String },
    email: { type: String },
    guest: { type: Number }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
