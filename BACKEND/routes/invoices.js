import express from "express";
import Invoice from "../models/Invoice.js";
import authMiddleware from "../middleware/authMiddleware.js";
import mongoose from "mongoose";

const router = express.Router();

// GET all invoices
router.get("/", authMiddleware, async (req, res) => {
  const invoices = await Invoice.find({ userId: req.user._id });
  res.json(invoices);
});
// POST create invoice
router.post("/", authMiddleware, async (req, res) => {
  const {
    clientName,
    clientEmail,
    clientPhone,
    items,
    subtotal,
    tax,
    total,
    status,
    dueDate,
  } = req.body;
  const userId = req.user._id;
  try {
    const newInvoice = await Invoice.create({
      userId,
      clientName,
      clientEmail,
      clientPhone,
      items,
      subtotal,
      tax,
      total,
      status,
      dueDate,
    });
    res.json(newInvoice);
  } catch (error) {
    res.status(500).json({ message: "New Invoice not created!" });
  }
});
// GET single invoice
router.get("/:id", authMiddleware, async (req, res) => {
  const invoices = await Invoice.find({ userId: req.user._id });
  res.json(invoices);
});
// PUT update invoice
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updateInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json(updateInvoice);
  } catch (error) {
    res.status(500).json({ message: "Update not completed!" });
  }
});
// DELETE invoice
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleteInvoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!deleteInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
