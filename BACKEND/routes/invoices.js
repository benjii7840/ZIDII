import express from "express";
import Invoice from "../models/Invoice.js";
import authMiddleware from "../middleware/authMiddleware.js";
import jwt from "jsonwebtoken";
import PDFDocument from "pdfkit";

const router = express.Router();

// GET all invoices
router.get("/:id/pdf", async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ message: "Invalid token" });

    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${invoice._id}.pdf`,
    );
    doc.pipe(res);

    doc.fontSize(28).font("Helvetica-Bold").text("INVOICE", { align: "right" });
    doc.moveDown();
    doc
      .fontSize(12)
      .font("Helvetica")
      .text("Zidi Business Finance", { align: "left" });
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
    doc.fontSize(12).font("Helvetica-Bold").text("Bill To:");
    doc.font("Helvetica").text(invoice.clientName);
    doc.text(invoice.clientEmail || "");
    doc.text(invoice.clientPhone || "");
    doc.moveDown();
    doc
      .font("Helvetica-Bold")
      .text(
        `Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "N/A"}`,
      );
    doc.text(`Status: ${invoice.status.toUpperCase()}`);
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
    doc.font("Helvetica-Bold");
    doc.text("Description", 50, doc.y, { width: 250 });
    doc.text("Qty", 300, doc.y - doc.currentLineHeight(), { width: 70 });
    doc.text("Price", 370, doc.y - doc.currentLineHeight(), { width: 80 });
    doc.text("Total", 450, doc.y - doc.currentLineHeight(), { width: 100 });
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
    doc.font("Helvetica");
    invoice.items.forEach((item) => {
      const lineTotal = item.quantity * item.price;
      doc.text(item.description, 50, doc.y, { width: 250 });
      doc.text(String(item.quantity), 300, doc.y - doc.currentLineHeight(), {
        width: 70,
      });
      doc.text(
        `KES ${item.price.toLocaleString()}`,
        370,
        doc.y - doc.currentLineHeight(),
        { width: 80 },
      );
      doc.text(
        `KES ${lineTotal.toLocaleString()}`,
        450,
        doc.y - doc.currentLineHeight(),
        { width: 100 },
      );
      doc.moveDown();
    });
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
    doc
      .font("Helvetica")
      .text(`Subtotal: KES ${invoice.subtotal?.toLocaleString()}`, {
        align: "right",
      });
    doc.text(
      `Tax (${invoice.tax}%): KES ${((invoice.subtotal * invoice.tax) / 100).toLocaleString()}`,
      { align: "right" },
    );
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .text(`Total: KES ${invoice.total?.toLocaleString()}`, {
        align: "right",
      });
    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

router.get("/:id/pdf", authMiddleware, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${invoice._id}.pdf`,
    );

    doc.pipe(res);

    // Header
    doc.fontSize(28).font("Helvetica-Bold").text("INVOICE", { align: "right" });
    doc.moveDown();

    // Business info
    doc
      .fontSize(12)
      .font("Helvetica")
      .text("Zidi Business Finance", { align: "left" });
    doc.moveDown();

    // Divider
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Client info
    doc.fontSize(12).font("Helvetica-Bold").text("Bill To:");
    doc.font("Helvetica").text(invoice.clientName);
    doc.text(invoice.clientEmail || "");
    doc.text(invoice.clientPhone || "");
    doc.moveDown();

    // Invoice details
    doc
      .font("Helvetica-Bold")
      .text(
        `Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "N/A"}`,
      );
    doc.text(`Status: ${invoice.status.toUpperCase()}`);
    doc.moveDown();

    // Items table header
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
    doc.font("Helvetica-Bold");
    doc.text("Description", 50, doc.y, { width: 250 });
    doc.text("Qty", 300, doc.y - doc.currentLineHeight(), { width: 70 });
    doc.text("Price", 370, doc.y - doc.currentLineHeight(), { width: 80 });
    doc.text("Total", 450, doc.y - doc.currentLineHeight(), { width: 100 });
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Items
    doc.font("Helvetica");
    invoice.items.forEach((item) => {
      const lineTotal = item.quantity * item.price;
      doc.text(item.description, 50, doc.y, { width: 250 });
      doc.text(String(item.quantity), 300, doc.y - doc.currentLineHeight(), {
        width: 70,
      });
      doc.text(
        `KES ${item.price.toLocaleString()}`,
        370,
        doc.y - doc.currentLineHeight(),
        { width: 80 },
      );
      doc.text(
        `KES ${lineTotal.toLocaleString()}`,
        450,
        doc.y - doc.currentLineHeight(),
        { width: 100 },
      );
      doc.moveDown();
    });

    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Totals
    doc
      .font("Helvetica")
      .text(`Subtotal: KES ${invoice.subtotal?.toLocaleString()}`, {
        align: "right",
      });
    doc.text(
      `Tax (${invoice.tax}%): KES ${((invoice.subtotal * invoice.tax) / 100).toLocaleString()}`,
      { align: "right" },
    );
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .text(`Total: KES ${invoice.total?.toLocaleString()}`, {
        align: "right",
      });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
