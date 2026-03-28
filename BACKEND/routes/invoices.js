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
// ✅ DOWNLOAD PDF (PROFESSIONAL DESIGN)
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

    // ===== HEADER =====
    doc.fontSize(26).font("Helvetica-Bold").text("INVOICE", { align: "right" });

    doc.moveDown(0.5);

    doc
      .fontSize(10)
      .font("Helvetica")
      .text("Zidi Business Finance")
      .text("Nairobi, Kenya")
      .text("support@zidi.com");

    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // ===== CLIENT + DETAILS =====
    const startY = doc.y;

    doc.fontSize(11).font("Helvetica-Bold").text("Bill To:", 50, startY);

    doc
      .font("Helvetica")
      .text(invoice.clientName, 50)
      .text(invoice.clientEmail || "-")
      .text(invoice.clientPhone || "-");

    doc.font("Helvetica-Bold").text("Invoice Details:", 350, startY);

    doc
      .font("Helvetica")
      .text(`Invoice ID: ${invoice._id}`, 350)
      .text(
        `Due Date: ${
          invoice.dueDate
            ? new Date(invoice.dueDate).toLocaleDateString()
            : "N/A"
        }`,
      )
      .text(`Status: ${invoice.status.toUpperCase()}`);

    doc.moveDown(2);

    // ===== TABLE HEADER =====
    const tableTop = doc.y;

    doc.font("Helvetica-Bold");
    doc.text("Description", 50, tableTop);
    doc.text("Qty", 300, tableTop);
    doc.text("Price", 370, tableTop);
    doc.text("Total", 450, tableTop);

    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    // ===== ITEMS =====
    doc.font("Helvetica");

    invoice.items.forEach((item) => {
      const y = doc.y + 5;
      const total = item.quantity * item.price;

      doc.text(item.description, 50, y, { width: 240 });
      doc.text(item.quantity.toString(), 300, y);
      doc.text(`KES ${item.price.toLocaleString()}`, 370, y);
      doc.text(`KES ${total.toLocaleString()}`, 450, y);

      doc.moveDown();
    });

    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // ===== TOTALS =====
    doc.font("Helvetica");

    doc.text(
      `Subtotal: KES ${invoice.subtotal?.toLocaleString()}`,
      350,
      doc.y,
      { align: "right" },
    );

    doc.text(
      `Tax (${invoice.tax}%): KES ${(
        (invoice.subtotal * invoice.tax) /
        100
      ).toLocaleString()}`,
      350,
      doc.y,
      { align: "right" },
    );

    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .text(`Total: KES ${invoice.total?.toLocaleString()}`, 350, doc.y, {
        align: "right",
      });

    doc.moveDown(2);

    // ===== FOOTER =====
    doc
      .fontSize(10)
      .font("Helvetica-Oblique")
      .text("Thank you for your business!", {
        align: "center",
      });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
