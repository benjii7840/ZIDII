import Expense from "../models/Expense.js";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all expenses
router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE expense
router.post("/", authMiddleware, async (req, res) => {
  const { amount, category, description } = req.body;

  try {
    const newExpense = await Expense.create({
      userId: req.user._id,
      amount,
      category,
      description,
    });

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE expense
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleteExpense = await Expense.findByIdAndDelete(req.params.id);

    if (!deleteExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
