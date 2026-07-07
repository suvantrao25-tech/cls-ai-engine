const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// IMPORTANT: correct import
const aiRoutes = require("./routes/aiRoutes");

// must be function (router)
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("CLS AI Engine Running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});