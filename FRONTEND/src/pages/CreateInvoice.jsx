import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { api } from "../utils/api";

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

  async function handleSubmit() {
    if (!clientName || items.length === 0) return;

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
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">New Invoice</h1>
          <button
            onClick={() => navigate("/invoices")}
            className="text-gray-400 hover:text-white text-sm transition"
          >
            ← Back
          </button>
        </div>

        {/* Client Details */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Client Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Client Name",
                value: clientName,
                setter: setClientName,
                placeholder: "John Doe",
              },
              {
                label: "Email",
                value: clientEmail,
                setter: setClientEmail,
                placeholder: "john@email.com",
              },
              {
                label: "Phone",
                value: clientPhone,
                setter: setClientPhone,
                placeholder: "0712345678",
              },
            ].map(({ label, value, setter, placeholder }) => (
              <div key={label}>
                <label className="text-gray-400 text-sm mb-1 block">
                  {label}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                Tax (%)
              </label>
              <input
                type="number"
                value={tax}
                onChange={(e) => setTax(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Items</h2>
          <div className="flex flex-col gap-3">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-5">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value)
                    }
                    placeholder="Description"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", Number(e.target.value))
                    }
                    placeholder="Qty"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      updateItem(index, "price", Number(e.target.value))
                    }
                    placeholder="Price"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>
                <div className="col-span-1 text-right text-gray-400 text-sm">
                  KES {(item.quantity * item.price).toLocaleString()}
                </div>
                <div className="col-span-1 text-right">
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(index)}
                      className="text-gray-500 hover:text-red-400 transition"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addItem}
            className="mt-4 text-purple-400 hover:text-purple-300 text-sm transition"
          >
            + Add Item
          </button>
        </div>

        {/* Totals */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>KES {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Tax ({tax}%)</span>
              <span>KES {taxAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-lg border-t border-white/10 pt-2 mt-2">
              <span>Total</span>
              <span>KES {total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition"
        >
          Create Invoice
        </button>
      </div>
    </Layout>
  );
};

export default CreateInvoice;
