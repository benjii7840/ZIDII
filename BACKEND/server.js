import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import invoiceRouter from "./routes/invoices.js";
import expenseRouter from "./routes/expenses.js";
import dashboardRouter from "./routes/dashboard.js";
import aiRouter from "./routes/ai.js";
import mongoose from "mongoose";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Connection error:", err));

console.log("MONGO_URI starts with:", process.env.MONGO_URI?.substring(0, 20));

const app = express();
app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.json({ message: "works" });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "api works" });
});

app.use("/api/auth", authRouter);
app.use("/api/invoices", invoiceRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/ai", aiRouter);

app.listen(process.env.PORT || 5002, () => {
  console.log("Server running");
});
