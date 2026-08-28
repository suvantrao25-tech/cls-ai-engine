const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());

// Razorpay webhook MUST receive the raw request body
// before express.json() parses it.
const razorpayWebhookRoutes = require("./routes/razorpayWebhookRoutes");
app.use("/api/webhook/razorpay", razorpayWebhookRoutes);

app.use(express.json());

// Routes
const aiRoutes = require("./routes/aiRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/ai", aiRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("CLS AI Engine Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
