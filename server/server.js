//C:\Users\Aditya Kumar\Acadimic\Program\Projects\Uncompleted\clothify\server\server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Razorpay from "razorpay";
import { v4 as uuidv4 } from "uuid";

dotenv.config(); // Load env vars first

const app = express();

// ------------------------------
// CORS FIX — REQUIRED FOR VERCEL
// ------------------------------
app.use(cors({
  origin: [
    "http://localhost:5173",       // local dev
    "https://clothify-hn3p.vercel.app" // your Vercel frontend URL
  ],
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

app.use(express.json());

// -----------------------------------
// RAZORPAY INSTANCE
// -----------------------------------
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// -----------------------------------
// TEST ROUTE
// -----------------------------------
app.get("/", (req, res) => {
  res.send("Clothify backend running 🚀");
});

// -----------------------------------
// CREATE ORDER API
// -----------------------------------
app.post("/api/create-order", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount: amount * 100,  // convert to paise
      currency: currency || "INR",
      receipt: uuidv4(),
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (error) {
    console.error("❌ Razorpay order error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// -----------------------------------
// START SERVER
// -----------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
