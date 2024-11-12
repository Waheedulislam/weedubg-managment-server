const MeetLink = require("../models/Meet");

// Error handling function
const handleError = (res, err, customMessage) => {
  console.error(customMessage, err); // Log error to the console with custom message
  res.status(500).json({ success: false, message: customMessage });
};

exports.createMeeting = async (req, res) => {
  console.log("Starting meeting creation process..."); // Log process start
  try {
    // const { paymentId } = req.body;
    // console.log("Received payment ID:", paymentId); // Log received payment ID

    // // Validate payment ID
    // if (!paymentId) {
    //   console.warn("Payment ID is missing."); // Warn if payment ID is missing
    //   return res.status(400).json({ success: false, message: "Payment ID is required" });
    // }

    // Mocking payment verification (replace with real SSLCommerz verification logic)
    const isPaymentVerified = true; // Replace with actual verification

    if (isPaymentVerified) {
      console.log("Payment Verified. Generating meeting link...");

      // Mocking Google Meet link (replace with actual Google Meet link generation)
      const meetLink = 'https://meet.google.com/wmh-tbcz-qho';

      // Save meet link to MongoDB
      const newMeetLink = new MeetLink({ meetLink });
      await newMeetLink.save();
      console.log("Meeting link saved to database:", meetLink); // Log meet link save

      res.json({ success: true, meetLink });
    } else {
      console.warn("Payment verification failed."); // Warn if payment verification fails
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (err) {
    handleError(res, err, "Error creating meeting");
  }
};

// Read (Retrieve) meeting link
exports.getMeetingLink = async (req, res) => {
  console.log("Fetching meeting link..."); // Log fetch action
  try {
    const meetLinkData = await MeetLink.findOne().sort({ createdAt: -1 });
    if (!meetLinkData) {
      console.warn("No meeting link found in the database."); // Warn if no link is found
      return res.status(404).json({ success: false, message: "Meeting link not found" });
    }
    console.log("Meeting link retrieved:", meetLinkData.meetLink); // Log retrieved link
    res.json({ success: true, meetLink: meetLinkData.meetLink });
  } catch (err) {
    handleError(res, err, "Error retrieving meeting link");
  }
};

// Update meeting link
exports.updateMeetingLink = async (req, res) => {
  console.log("Updating meeting link..."); // Log update action
  try {
    const { meetLinkId, newMeetLink } = req.body;

    // Ensure meetLinkId and newMeetLink are provided
    if (!meetLinkId || !newMeetLink) {
      console.warn("meetLinkId or newMeetLink missing."); // Warn if required data is missing
      return res.status(400).json({ success: false, message: "meetLinkId and newMeetLink are required" });
    }

    // Update the meeting link in the database
    const updatedMeetLink = await MeetLink.findByIdAndUpdate(
      meetLinkId,
      { meetLink: newMeetLink },
      { new: true }
    );

    if (!updatedMeetLink) {
      console.warn("Meeting link not found for update."); // Warn if link is not found
      return res.status(404).json({ success: false, message: "Meeting link not found" });
    }

    console.log("Meeting link updated:", updatedMeetLink.meetLink); // Log updated link
    res.json({ success: true, meetLink: updatedMeetLink.meetLink });
  } catch (err) {
    handleError(res, err, "Error updating meeting link");
  }
};

// Delete meeting link
exports.deleteMeetingLink = async (req, res) => {
  console.log("Deleting meeting link..."); // Log delete action
  try {
    const { meetLinkId } = req.body;

    if (!meetLinkId) {
      console.warn("meetLinkId is missing."); // Warn if meetLinkId is missing
      return res.status(400).json({ success: false, message: "meetLinkId is required" });
    }

    const deletedMeetLink = await MeetLink.findByIdAndDelete(meetLinkId);

    if (!deletedMeetLink) {
      console.warn("Meeting link not found for deletion."); // Warn if link is not found
      return res.status(404).json({ success: false, message: "Meeting link not found" });
    }

    console.log("Meeting link deleted successfully:", deletedMeetLink.meetLink); // Log deleted link
    res.json({ success: true, message: "Meeting link deleted successfully" });
  } catch (err) {
    handleError(res, err, "Error deleting meeting link");
  }
};
