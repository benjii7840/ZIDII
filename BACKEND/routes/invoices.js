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

    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${invoice._id}.pdf`,
    );

    doc.pipe(res);

    // ====================
    // COLORS
    // ====================
    const PURPLE = "#6C3CE9";
    const LIGHT = "#F5F5F5";
    const DARK = "#222222";

    // ====================
    // HEADER
    // ====================
    doc.rect(0, 0, 612, 90).fill(PURPLE);

    doc
      .fillColor("white")
      .font("Helvetica-Bold")
      .fontSize(28)
      .text("INVOICE", 40, 30);

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(`Invoice #: ${invoice._id}`, 350, 30, {
        width: 200,
        align: "right",
      });

    doc.text(`Date: ${new Date().toLocaleDateString()}`, 350, 48, {
      width: 200,
      align: "right",
    });

    doc.fillColor("black");
    doc.y = 120;

    // ====================
    // BILLING CARDS
    // ====================
    const cardY = doc.y;

    doc.rect(40, cardY, 240, 95).fillAndStroke(LIGHT, "#DDDDDD");

    doc
      .fillColor(PURPLE)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("Billed By", 55, cardY + 10);

    doc
      .fillColor(DARK)
      .font("Helvetica")
      .fontSize(10)
      .text("Zidi Business Finance", 55, cardY + 30)
      .text("Nairobi, Kenya")
      .text("support@zidi.com");

    doc.rect(320, cardY, 240, 95).fillAndStroke(LIGHT, "#DDDDDD");

    doc
      .fillColor(PURPLE)
      .font("Helvetica-Bold")
      .text("Billed To", 335, cardY + 10);

    doc
      .fillColor(DARK)
      .font("Helvetica")
      .text(invoice.clientName || "-", 335, cardY + 30)
      .text(invoice.clientEmail || "-")
      .text(invoice.clientPhone || "-");

    doc.y = cardY + 120;

    // ====================
    // INVOICE INFO
    // ====================
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(DARK)
      .text(
        `Due Date: ${
          invoice.dueDate
            ? new Date(invoice.dueDate).toLocaleDateString()
            : "N/A"
        }`,
        40,
      );

    doc.text(
      `Status: ${invoice.status?.toUpperCase() || "PENDING"}`,
      420,
      doc.y - 12,
    );

    doc.moveDown(2);

    // ====================
    // TABLE HEADER
    // ====================
    const tableTop = doc.y;

    doc.rect(40, tableTop, 520, 28).fill(PURPLE);

    doc.fillColor("white").font("Helvetica-Bold").fontSize(10);

    doc.text("Description", 55, tableTop + 9);
    doc.text("Qty", 300, tableTop + 9);
    doc.text("Price", 370, tableTop + 9);
    doc.text("Amount", 460, tableTop + 9);

    // ====================
    // ITEMS
    // ====================
    let rowY = tableTop + 35;

    invoice.items.forEach((item, index) => {
      const total = item.quantity * item.price;

      if (index % 2 === 0) {
        doc.rect(40, rowY - 5, 520, 26).fill("#FAFAFA");
      }

      doc.fillColor("black");
      doc.font("Helvetica");

      doc.text(item.description || "-", 55, rowY, {
        width: 220,
      });

      doc.text(String(item.quantity), 300, rowY);

      doc.text(`KES ${item.price.toLocaleString()}`, 370, rowY);

      doc.text(`KES ${total.toLocaleString()}`, 460, rowY);

      rowY += 28;
    });

    doc.y = rowY + 20;

    // ====================
    // TOTALS
    // ====================
    const taxAmount = ((invoice.subtotal || 0) * (invoice.tax || 0)) / 100;

    const totalBoxY = doc.y;

    doc.font("Helvetica").fontSize(11).fillColor(DARK);

    doc.text("Subtotal", 340, totalBoxY);
    doc.text(`KES ${(invoice.subtotal || 0).toLocaleString()}`, 450, totalBoxY);

    doc.text(`Tax (${invoice.tax || 0}%)`, 340, totalBoxY + 25);

    doc.text(`KES ${taxAmount.toLocaleString()}`, 450, totalBoxY + 25);

    // TOTAL BOX
    doc.rect(330, totalBoxY + 60, 220, 45).fill(PURPLE);

    doc
      .fillColor("white")
      .font("Helvetica-Bold")
      .fontSize(16)
      .text(
        `TOTAL: KES ${(invoice.total || 0).toLocaleString()}`,
        345,
        totalBoxY + 75,
      );

    // ====================
    // FOOTER
    // ====================
    doc.y = totalBoxY + 150;

    doc
      .fillColor("black")
      .font("Helvetica")
      .fontSize(10)
      .text("Thank you for your business!", {
        align: "center",
      });

    doc
      .fillColor("gray")
      .fontSize(8)
      .text("Generated by Zidi Business Finance", {
        align: "center",
      });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
