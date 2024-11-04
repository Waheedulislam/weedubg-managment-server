const express = require("express");
const router = express.Router();
const { auth, roleCheck } = require("../middleware/authMiddleware");
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  rsvpEvent,
} = require("../controllers/eventController");

// Create a new event (Requires authentication)
router.post("/create", auth, createEvent);

// Get all events with pagination, sorting, and filtering
router.get("/", getEvents);

// Get a single event by ID
router.get("/:id", getEventById);

// Update an existing event (Only the event organizer can update)
router.put("/:id", auth, updateEvent);

// Delete an event (Only the event organizer can delete)
router.delete("/:id", auth, deleteEvent);

// RSVP to an event
router.post("/:id/rsvp", auth, rsvpEvent);

module.exports = router;
