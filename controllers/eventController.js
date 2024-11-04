const Event = require("../models/Event");

// Create a new event
exports.createEvent = async (req, res) => {
  const { title, description, date, location } = req.body;

  console.log(req.body);

  try {
    const event = await Event.create({
      title,
      description,
      date,
      location,
      organizer: req.user._id,
    });
    res.status(201).json(event);
    console.log(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all events with pagination, sorting, and filtering
exports.getEvents = async (req, res) => {
  const { page = 1, limit = 10, sortBy = "date", order = "asc" } = req.query;
  try {
    const events = await Event.find()
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing event
exports.updateEvent = async (req, res) => {
  const { title, description, date, location } = req.body;
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if the user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this event" });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the user is the organizer or has an admin role
    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this event" });
    }

    // Delete the event
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// RSVP to an event
exports.rsvpEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.rsvps.includes(req.user._id)) {
      return res.status(400).json({ message: "Already RSVPed" });
    }

    event.rsvps.push(req.user._id);
    await event.save();
    res.json({ message: "RSVP successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
