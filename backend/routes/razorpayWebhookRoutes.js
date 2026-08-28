const express = require("express");
const crypto = require("crypto");

const router = express.Router();

router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is missing");
      return res.status(500).json({
        success: false,
        message: "Webhook configuration missing",
      });
    }

    const signature = req.headers["x-razorpay-signature"];

    if (!signature) {
      console.error("Missing Razorpay webhook signature");
      return res.status(400).json({
        success: false,
        message: "Webhook signature missing",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body)
      .digest("hex");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
      )
    ) {
      console.error("Invalid Razorpay webhook signature");
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    const event = JSON.parse(req.body.toString("utf8"));

    console.log("========== RAZORPAY WEBHOOK ==========");
    console.log("EVENT:", event.event);
    console.log("RECEIVED:", new Date().toISOString());
    console.log("=======================================");

    return res.status(200).json({
      success: true,
      received: true,
    });
  } catch (error) {
    console.error("========== WEBHOOK ERROR ==========");
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
});

module.exports = router;
