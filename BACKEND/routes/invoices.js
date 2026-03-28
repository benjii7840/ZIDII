import express from "express";
import Invoice from "../models/Invoice.js";
import authMiddleware from "../middleware/authMiddleware.js";
import PDFDocument from "pdfkit";
import jwt from "jsonwebtoken";

const router = express.Router();

//
// ✅ GET ALL INVOICES
//
router.get("/", authMiddleware, async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user._id });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//
// ✅ GET SINGLE INVOICE
//
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//
// ✅ CREATE INVOICE
//
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newInvoice = await Invoice.create({
      ...req.body,
      userId: req.user._id,
    });

    res.json(newInvoice);
  } catch (error) {
    res.status(500).json({ message: "Invoice not created!" });
  }
});

//
// ✅ UPDATE INVOICE
//
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed!" });
  }
});

//
// ✅ DELETE INVOICE
//
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Invoice.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//
// ✅ DOWNLOAD PDF (PUBLIC WITH TOKEN)
//
router.get("/:id/pdf", async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(401).json({ message: "No token" });

    jwt.verify(token, process.env.JWT_SECRET);

    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Not found" });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${invoice._id}.pdf`,
    );

    doc.pipe(res);

    doc.fontSize(28).text("INVOICE", { align: "right" });
    doc.moveDown();

    doc.text(`Client: ${invoice.clientName}`);
    doc.text(`Email: ${invoice.clientEmail || "-"}`);
    doc.moveDown();

    invoice.items.forEach((item) => {
      doc.text(
        `${item.description} - ${item.quantity} x ${item.price} = ${
          item.quantity * item.price
        }`,
      );
    });

    doc.moveDown();
    doc.text(`Total: KES ${invoice.total}`);

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
