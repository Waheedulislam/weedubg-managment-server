const express = require("express");
const router = express.Router();
const { createPayment, paymentSuccess } = require("../controllers/paymentController");

// POST method for creating payment
router.post("/create-payment", createPayment);

// GET method for payment success
router.post("/", paymentSuccess); // 'payment-success' should handle GET requests

// POST method for handling payment success (if needed)
router.post("/payment-success", (req, res) => {
    // handle POST request if needed (depends on your logic)
    res.send("Payment was successful.");
});

module.exports = router;
