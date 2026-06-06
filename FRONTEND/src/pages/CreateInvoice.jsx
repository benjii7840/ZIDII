import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { api } from "../utils/api";
import { Plus, Trash2, ArrowLeft, Check } from "lucide-react";

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tax, setTax] = useState(16);
  const [items, setItems] = useState([
    { description: "", quantity: 1, price: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setItems(updated);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );
  const taxAmount = (subtotal * tax) / 100;
  const total = subtotal + taxAmount;

  const isFormValid =
    clientName && items.some((item) => item.description && item.price > 0);

  async function handleSubmit() {
    if (!isFormValid) return;

    setLoading(true);
    try {
      await api.post("/api/invoices", {
        clientName,
        clientEmail,
        clientPhone,
        dueDate,
        items,
        subtotal,
        tax,
        total,
      });
      navigate("/invoices");
    } catch (error) {
      console.error("Error creating invoice:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Create Invoice
              </h1>
              <p className="text-gray-500 mt-1">
                Add client details and line items
              </p>
            </div>
            <button
              onClick={() => navigate("/invoices")}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>

          {/* Client Details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">👤</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Client Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="john@email.com"
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Phone
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="0712345678"
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={tax}
                  onChange={(e) => setTax(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">📝</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Invoice Items
                </h2>
              </div>
              <button
                onClick={addItem}
                className="flex items-center gap-2 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            {/* Items Table Header */}
            <div className="hidden sm:grid grid-cols-12 gap-3 mb-3 pb-3 border-b border-gray-200">
              <div className="col-span-5 text-xs font-semibold text-gray-600 uppercase">
                Description
              </div>
              <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase">
                Quantity
              </div>
              <div className="col-span-3 text-xs font-semibold text-gray-600 uppercase">
                Unit Price (KES)
              </div>
              <div className="col-span-2 text-right text-xs font-semibold text-gray-600 uppercase">
                Amount
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-gray-50 p-4 rounded-lg"
                >
                  <div className="sm:col-span-5">
                    <label className="sm:hidden text-xs font-semibold text-gray-600 block mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(index, "description", e.target.value)
                      }
                      placeholder="e.g., Web Development Services"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="sm:hidden text-xs font-semibold text-gray-600 block mb-1">
                      Qty
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "quantity",
                          Number(e.target.value) || 1,
                        )
                      }
                      placeholder="1"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="sm:hidden text-xs font-semibold text-gray-600 block mb-1">
                      Unit Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(index, "price", Number(e.target.value) || 0)
                      }
                      placeholder="0"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                    />
                  </div>
                  <div className="sm:col-span-1 text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {(item.quantity * item.price).toLocaleString()}
                    </p>
                  </div>
                  <div className="sm:col-span-1 text-right">
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(index)}
                        className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition border border-gray-200"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Summary Box */}
            <div className="md:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase">
                Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Subtotal</span>
                  <span className="text-gray-900 font-semibold">
                    KES {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600 text-sm">Tax ({tax}%)</span>
                  <span className="text-gray-900 font-semibold">
                    KES {Math.round(taxAmount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-bold">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">
                    KES {Math.round(total).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-blue-900 mb-4">
                Invoice Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-blue-600 text-xs uppercase mb-1">Items</p>
                  <p className="text-blue-900 font-bold text-lg">
                    {items.filter((i) => i.description && i.price > 0).length}
                  </p>
                </div>
                <div>
                  <p className="text-blue-600 text-xs uppercase mb-1">Client</p>
                  <p className="text-blue-900 font-semibold truncate">
                    {clientName || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-blue-600 text-xs uppercase mb-1">Status</p>
                  <p className="text-blue-900 font-semibold">
                    {isFormValid ? "✓ Ready" : "✗ Incomplete"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/invoices")}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || loading}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                isFormValid
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Create Invoice
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateInvoice;
