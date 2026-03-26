import mongoose from "mongoose";

const invoiceSchema = mongoose.Schema({
  items: [
    {
      description: String,
      quantity: Number,
      price: Number,
    },
  ],
  status: {
    type: String,
    enum: ["draft", "sent", "paid"],
    default: "draft",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  clientName: {
    type: String,
  },
  clientEmail: {
    type: String,
  },
  clientPhone: {
    type: String,
  },
  subtotal: {
    type: Number,
  },
  tax: {
    type: Number,
  },
  total: {
    type: Number,
  },
  dueDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
