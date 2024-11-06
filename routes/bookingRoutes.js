const express = require("express");
const router = express.Router();

const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");

// Create a new booking
router.post("/", createBooking);

// Get all bookings
router.get("/", getAllBookings);

// Get a booking by ID
router.get("/:id", getBookingById);

// Update booking
router.put("/:id", updateBooking);

// Delete booking
router.delete("/:id", deleteBooking);

module.exports = router;
