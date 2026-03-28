import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import invoiceRouter from "./routes/invoices.js";
import expenseRouter from "./routes/expenses.js";
import dashboardRouter from "./routes/dashboard.js";
import aiRouter from "./routes/ai.js";

console.log("Routes loaded successfully");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Connection error:", err));

app.use("/api/auth", authRouter);
//app.use("/api/invoices", invoiceRouter);
//app.use("/api/expenses", expenseRouter);
//app.use("/api/dashboard", dashboardRouter);
//app.use("/api/ai", aiRouter);

app.get("/test", (req, res) => {
  res.json({ message: "Server is working" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
