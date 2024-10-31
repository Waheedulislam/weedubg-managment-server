const express = require("express");
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  rsvpEvent,
} = require("../Controllers/eventController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Event routes
router.get("/", authMiddleware, getEvents); // Get all events with authentication
router.get("/:id", getEventById); // Get event by ID
router.post("/", authMiddleware, roleMiddleware("organizer"), createEvent); // Create event with organizer role
router.put("/:id", authMiddleware, roleMiddleware("organizer"), updateEvent); // Update event with organizer role
router.delete("/:id", authMiddleware, roleMiddleware("organizer"), deleteEvent); // Delete event with organizer role
router.post("/:id/rsvp", authMiddleware, rsvpEvent); // RSVP to event

module.exports = router;
