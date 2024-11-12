const express = require("express");
const router = express.Router();
const { createPayment,paymentSuccess } = require("../controllers/paymentController");

router.post("/create-payment", createPayment),
router.post("/payment-success", paymentSuccess),

module.exports = router;
