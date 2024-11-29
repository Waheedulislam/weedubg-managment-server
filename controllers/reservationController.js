const Reservation = require("../models/Reservation");


const handleError = (res, err, message) => {
    console.error(err); 
    res.status(500).json({
        success: false,
        message: message || "An error occurred.",
        error: err.message,
    });
};

// Create Reservation
exports.createReservation = async (req, res) => {
    try {
        const reservation = req.body; 
        const result = await Reservation.create(reservation);
        res.status(201).json({
            success: true,
            message: "Reservation created successfully",
            data: result,
        });
    } catch (err) {
        handleError(res, err, "Error creating reservation");
    }
};

// Get All Reservations
exports.getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find(); 
        res.status(200).json({
            success: true,
            message: "Reservations retrieved successfully",
            data: reservations,
        });
    } catch (err) {
        handleError(res, err, "Error retrieving reservations");
    }
};

// Get a Single Reservation by ID
exports.getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findById(id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Reservation retrieved successfully",
            data: reservation,
        });
    } catch (err) {
        handleError(res, err, "Error retrieving reservation by ID");
    }
};
