import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Invoice from "../models/Invoice.js";
import Expense from "../models/Expense.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    // 1. Fetch all paid invoices for this user
    const paidInvoices = await Invoice.find({
      userId: req.user._id,
      status: "paid",
    });

    const unpaidInvoices = await Invoice.find({
      userId: req.user._id,
      status: { $ne: "paid" },
    });

    const expenses = await Expense.find({ userId: req.user._id });

    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const profit = totalRevenue - totalExpenses;
    const outstandingCount = unpaidInvoices.length;
    const outstandingAmount = unpaidInvoices.reduce(
      (sum, inv) => sum + inv.total,
      0,
    );

    res.json({
      totalRevenue,
      totalExpenses,
      profit,
      outstandingCount,
      outstandingAmount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
