import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRouter from "./routes/auth.js";
import invoiceRouter from "./routes/invoices.js";
import expenseRouter from "./routes/expenses.js";
import dashboardRouter from "./routes/dashboard.js";
import aiRouter from "./routes/ai.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Connection error:", err));

// Test routes
app.get("/test", (req, res) => {
  res.json({ message: "works" });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "api works" });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/invoices", invoiceRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/ai", aiRouter);

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
