const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const Payment = require("../models/Payment");

exports.createPayment = async (req, res) => {
    console.log("Starting payment creation process...");

    const paymentInfo = req.body;

    const tran_id = uuidv4();
    const userEmail = paymentInfo.customerEmail;

    const initiateData = {
        store_id: process.env.SSL_STORE_ID,
        store_passwd: process.env.SSL_STORE_PASSWORD,
        total_amount: paymentInfo.planPrice,
        currency: "BDT",
        tran_id: tran_id,
        // success_url: "http://localhost:5000/payment-success",
        success_url: "http://localhost:5173/about",
        fail_url: "http://localhost:5000/payment-fail",
        cancel_url: "http://localhost:5000/payment-cancel",
        cus_name: paymentInfo.customerName,
        cus_email: userEmail,
        cus_add1: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        shipping_method: "NO",
        product_name: "Computer",
        product_category: "Electronic",
        product_profile: "general",
        multi_card_name: "mastercard,visacard,amexcard",
    };

    try {
        const response = await axios({
            method: "POST",
            url: "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
            data: initiateData,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        const newPayment = {
            paymentType: response.data.card_brand || "N/A",
            paymentIssuer: response.data.card_issuer || null,
            customerName: paymentInfo.customerName || "Unknown",
            customerEmail: userEmail,
            paymentId: tran_id,
            eventPlan: paymentInfo.eventPlan,
            planPrice: paymentInfo.planPrice,
            status: "Pending",
            timestamp: new Date(),
        };
        // console.log("New payment object to save:", newPayment);

        const existingUser = await Payment.findOne({ customerEmail: userEmail });
        // console.log("Existing user check result:", existingUser);

        if (existingUser) {
            console.log("User exists. Updating payment information...");
            const updateResult = await Payment.updateOne(
                { customerEmail: userEmail },
                { $push: { userPayment: newPayment } }
            );
            // console.log("Update result:", updateResult);

            if (updateResult.matchedCount === 0 || updateResult.modifiedCount === 0) {
                // console.error("Payment update failed for existing user.");
                return res.status(500).send("Payment update failed");
            }
        } else {
            // console.log("No existing user. Creating new user document...");
            const newUser = { customerEmail: userEmail, userPayment: [newPayment] };
            const insertResult = await Payment.create(newUser);
            // console.log("Insert result for new user:", insertResult);

            if (!insertResult) {
                // console.error("Failed to insert new user");
                return res.status(500).send("Failed to insert new user");
            }
        }

        // console.log("Payment process complete. Returning payment URL.");
        res.send({ paymentUrl: response.data.GatewayPageURL });
    } catch (error) {
        console.error("Error creating payment:", error);
        res.status(500).send("Payment creation failed");
    }
};

// success payment api:

exports.paymentSuccess = async (req, res) => {
    try {
        const successData = req.body;
        // console.log("Success data from SSLCommerz:", successData);

        // Check if the payment status is valid
        if (successData.status !== "VALID") {
            return res.status(401).json({ message: "Unauthorized Payment, Invalid Payment" });
        }

        // Log transaction ID for verification
        const transactionId = successData.tran_id;
        // console.log("Transaction ID:", transactionId);

        // Update the specific payment status in the database
        const query = { "userPayment.paymentId": transactionId };
        const update = {
            $set: {
                "userPayment.$.status": "Success", // Update the specific payment status
                "userPayment.$.paymentType": successData.card_brand,
                "userPayment.$.paymentIssuer": successData.card_issuer,
            },
        };

        const result = await Payment.updateOne(query, update);
        // console.log("Database update result:", result);

        // Check if the payment status update was successful
        if (result.modifiedCount === 1) {
            console.log("Payment status successfully updated.");
            return res.redirect("http://localhost:5173/about"); // Redirect to the /about page after success
        } else {
            console.error("Payment status update failed.");
            return res.status(400).json({ message: "Payment update failed" });
        }
    } catch (error) {
        console.error("Error updating payment status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
