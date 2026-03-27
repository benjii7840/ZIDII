import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { api } from "../utils/api";

const categories = [
  "food",
  "transport",
  "utilities",
  "supplies",
  "marketing",
  "other",
];

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("other");
  const [description, setDescription] = useState("");

  useEffect(() => {
    api.get("/api/expenses").then((data) => {
      setExpenses(data);
      setLoading(false);
    });
  }, []);

  async function handleAddExpense() {
    if (!amount) return;
    const data = await api.post("/api/expenses", {
      amount: Number(amount),
      category,
      description,
    });
    setExpenses([...expenses, data]);
    setAmount("");
    setCategory("other");
    setDescription("");
    setShowForm(false);
  }

  async function handleDelete(id) {
    await api.delete(`/api/expenses/${id}`);
    setExpenses(expenses.filter((e) => e._id !== id));
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Expenses</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            + Add Expense
          </button>
        </div>

        {/* Add Expense Form */}
        {showForm && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <h2 className="text-white font-semibold mb-4">New Expense</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">
                  Amount (KES)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="5000"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Office supplies"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAddExpense}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition"
              >
                Save Expense
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white text-sm px-5 py-2 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Expenses List */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <p className="text-gray-500 text-center py-12">Loading...</p>
          ) : expenses.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No expenses yet.</p>
          ) : (
            expenses.map((expense) => (
              <div
                key={expense._id}
                className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-white font-medium">
                    {expense.description || "No description"}
                  </p>
                  <p className="text-gray-500 text-sm capitalize">
                    {expense.category}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <p className="text-red-400 font-semibold">
                    KES {expense.amount?.toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleDelete(expense._id)}
                    className="text-gray-500 hover:text-red-400 transition text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Expenses;
