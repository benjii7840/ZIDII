import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Invoice from "../models/Invoice.js";
import Expense from "../models/Expense.js";
import OpenAI from "openai";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/chat", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    // 1. Fetch user's financial data
    const paidInvoices = await Invoice.find({
      userId: req.user._id,
      status: "paid",
    });
    const unpaidInvoices = await Invoice.find({
      userId: req.user._id,
      status: { $ne: "paid" },
    });
    const expenses = await Expense.find({ userId: req.user._id });

    // 2. Calculate stats
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const profit = totalRevenue - totalExpenses;
    const outstandingCount = unpaidInvoices.length;
    const outstandingAmount = unpaidInvoices.reduce(
      (sum, inv) => sum + inv.total,
      0,
    );

    // 3. Build system prompt with real data
    const systemPrompt = `You are a financial assistant for a small business.
Here is their current financial data:
- Total Revenue: KES ${totalRevenue}
- Total Expenses: KES ${totalExpenses}
- Profit: KES ${profit}
- Outstanding invoices: ${outstandingCount} worth KES ${outstandingAmount}
Answer questions about their finances helpfully and concisely.`;

    // 4. Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    // 5. Send back response
    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
