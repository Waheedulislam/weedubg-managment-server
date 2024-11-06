const Booking = require("../models/Booking");

// Reusable function to handle errors
const handleError = (res, error, message) => {
  console.error(message, error.message);
  return res.status(500).json({ message, error: error.message });
};

// Reusable function to validate booking data
const validateBookingData = ({ event, customer, date, tickets, status }) => {
  if (!event || !customer || !date || !tickets || !status) {
    return { isValid: false, message: "All fields are required." };
  }
  return { isValid: true };
};

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { event, customer, date, tickets, status } = req.body;

    // Validate request
    const validation = validateBookingData({
      event,
      customer,
      date,
      tickets,
      status,
    });
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message });
    }

    const newBooking = new Booking({ event, customer, date, tickets, status });
    await newBooking.save();

    console.log("Booking created successfully:", newBooking);
    return res
      .status(201)
      .json({ message: "Booking created successfully!", booking: newBooking });
  } catch (err) {
    handleError(res, err, "Error creating booking");
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    console.log("Fetched all bookings:", bookings);
    return res.status(200).json({ bookings });
  } catch (err) {
    handleError(res, err, "Error fetching bookings");
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findById(id);

    if (!booking) {
      console.log("Booking not found:", id);
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("Fetched booking by ID:", booking);
    return res.status(200).json({ booking });
  } catch (err) {
    handleError(res, err, "Error fetching booking");
  }
};

// Update booking details
exports.updateBooking = async (req, res) => {
  const { id } = req.params;
  const { event, customer, date, tickets, status } = req.body;

  try {
    const validation = validateBookingData({
      event,
      customer,
      date,
      tickets,
      status,
    });
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { event, customer, date, tickets, status },
      { new: true }
    );

    if (!updatedBooking) {
      console.log("Booking not found for update:", id);
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("Booking updated successfully:", updatedBooking);
    return res
      .status(200)
      .json({
        message: "Booking updated successfully",
        booking: updatedBooking,
      });
  } catch (err) {
    handleError(res, err, "Error updating booking");
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      console.log("Booking not found for deletion:", id);
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("Booking deleted successfully:", deletedBooking);
    return res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    handleError(res, err, "Error deleting booking");
  }
};
