const express = require("express");
const Razorpay = require("razorpay");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: 29900, // ₹299 in paise
      currency: "INR",
      receipt: "cls_ai_creator_plan",
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
});

module.exports = router;