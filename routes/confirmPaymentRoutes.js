app.post("/confirm-payment", async (req, res) => {
    const { paymentId } = req.body; // Expecting paymentId in the body of the request
  
    if (!paymentId) {
      return res.status(400).json({ success: false, message: "Payment ID is required" });
    }
  
    const isPaymentVerified = true;
    if (isPaymentVerified) {
      try {
        console.log("Payment Verified");
        // const authClient = await authenticate();
        const meetLink =  'https://meet.google.com/wmh-tbcz-qho';
        console.log(meetLink)
        res.json({ meetLink });
      } catch (error) {
        console.error("Error creating Google Meet link", error);
        res.status(500).json({ error: "Error creating Google Meet link" });
      }
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  });