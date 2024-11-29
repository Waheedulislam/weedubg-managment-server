const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const Payment = require("../models/Payment");

// Payment creation handler
exports.createPayment = async (req, res) => {
    console.log("=== Starting payment creation process ===");

    try {
        const paymentInfo = req.body;
        console.log("Received Payment Info:", paymentInfo);

        if (!paymentInfo.customerEmail || !paymentInfo.customerName || !paymentInfo.planPrice) {
            return res.status(400).send("Invalid payment information provided");
        }

        const tran_id = uuidv4();
        const userEmail = paymentInfo.customerEmail;

        const initiateData = {
            store_id: process.env.SSL_STORE_ID,
            store_passwd: process.env.SSL_STORE_PASSWORD,
            total_amount: paymentInfo.planPrice,
            currency: "BDT",
            tran_id: tran_id,
            success_url: "http://localhost:5000/payment-success",  // This should be a GET request route
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
            product_name: "Wedding Planning Service",
            product_category: "Service",
            product_profile: "general",
            multi_card_name: "mastercard,visacard,amexcard",
        };

        // Request to SSLCommerz API
        const response = await axios.post(
            "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
            new URLSearchParams(initiateData).toString(),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        if (!response.data.GatewayPageURL) {
            throw new Error("Payment Gateway URL not found in SSLCommerz response");
        }

        // Create payment record
        const newPayment = {
            paymentType: response.data.card_brand || "N/A",
            paymentIssuer: response.data.card_issuer || null,
            customerName: paymentInfo.customerName,
            customerEmail: userEmail,
            paymentId: tran_id,
            eventPlan: paymentInfo.eventPlan,
            planPrice: paymentInfo.planPrice,
            status: "Pending",
            timestamp: new Date(),
        };

        // Check if user exists and create or update payment
        const existingUser = await Payment.findOne({ customerEmail: userEmail });
        if (existingUser) {
            await Payment.updateOne({ customerEmail: userEmail }, { $push: { userPayment: newPayment } });
        } else {
            await Payment.create({ customerEmail: userEmail, userPayment: [newPayment] });
        }

        // Return payment URL
        res.send({ paymentUrl: response.data.GatewayPageURL });
    } catch (error) {
        console.error("Error in createPayment:", error.message);
        res.status(500).send("Payment creation failed");
    }
};

// Payment success handler (GET request)
// Payment success handler (GET request)
exports.paymentSuccess = async (req, res) => {
    console.log("=== Payment Success Callback Triggered ===");

    try {
        const successData = req.query;
        console.log("Success Data Received:", successData);

        if (!successData.tran_id || successData.status !== "VALID") {
            return res.status(401).json({ message: "Invalid payment data or unauthorized payment" });
        }

        const query = { "userPayment.paymentId": successData.tran_id };
        const update = {
            $set: {
                "userPayment.$.status": "Success",
                "userPayment.$.paymentType": successData.card_brand,
                "userPayment.$.paymentIssuer": successData.card_issuer,
            },
        };

        const result = await Payment.updateOne(query, update);
        if (result.modifiedCount === 1) {
            return res.redirect("http://localhost:5173/payment-success");  // Redirect to your React success page
        } else {
            return res.status(400).json({ message: "Payment update failed" });
        }
    } catch (error) {
        console.error("Error in paymentSuccess:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
