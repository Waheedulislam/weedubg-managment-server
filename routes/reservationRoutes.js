const express = require("express");
const router = express.Router();
const { createReservation } = require("../controllers/reservationController");

router.post("/reservation", createReservation)

module.exports = router;
