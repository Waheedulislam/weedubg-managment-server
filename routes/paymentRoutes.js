const express = require("express");
const router = express.Router();
const { createPayment } = require("../controllers/paymentController");

router.post("/create-payment", createPayment),
router.post("/payment-success", createPayment),

module.exports = router;
