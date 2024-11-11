const express = require("express");
const router = express.Router();
const { createMeeting } = require("../controllers/meetController");

// Route to create a new meeting
router.post("/meet", createMeeting);

module.exports = router;
