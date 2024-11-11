const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    meetLink: { type: String, required: true }
  }
);

module.exports = mongoose.model("MeetLink", eventSchema);
