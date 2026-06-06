import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { api } from "../utils/api";
import {
  Plus,
  Trash2,
  UtensilsCrossed,
  Car,
  Zap,
  Package,
  Megaphone,
  MoreHorizontal,
} from "lucide-react";

const categories = [
  "food",
  "transport",
  "utilities",
  "supplies",
  "marketing",
  "other",
];

const categoryIcons = {
  food: <UtensilsCrossed className="w-5 h-5" />,
  transport: <Car className="w-5 h-5" />,
  utilities: <Zap className="w-5 h-5" />,
  supplies: <Package className="w-5 h-5" />,
  marketing: <Megaphone className="w-5 h-5" />,
  other: <MoreHorizontal className="w-5 h-5" />,
};

const categoryColors = {
  food: "bg-orange-100 text-orange-700",
  transport: "bg-blue-100 text-blue-700",
  utilities: "bg-yellow-100 text-yellow-700",
  supplies: "bg-purple-100 text-purple-700",
  marketing: "bg-pink-100 text-pink-700",
  other: "bg-gray-100 text-gray-700",
};

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("other");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState("all");

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
    if (window.confirm("Are you sure you want to delete this expense?")) {
      await api.delete(`/api/expenses/${id}`);
      setExpenses(expenses.filter((e) => e._id !== id));
    }
  }

  const filteredExpenses =
    filter === "all" ? expenses : expenses.filter((e) => e.category === filter);

  const stats = {
    total: expenses.reduce((sum, e) => sum + (e.amount || 0), 0),
    count: expenses.length,
    byCategory: categories.map((cat) => ({
      category: cat,
      amount: expenses
        .filter((e) => e.category === cat)
        .reduce((sum, e) => sum + (e.amount || 0), 0),
      count: expenses.filter((e) => e.category === cat).length,
    })),
  };

  const topCategories = stats.byCategory
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
              <p className="text-gray-500 mt-1">
                Track and manage your business expenses
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-3 rounded-lg transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Expense
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-gray-600 text-sm mb-2">Total Expenses</p>
              <p className="text-3xl font-bold text-gray-900">
                KES {stats.total.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {stats.count} expenses
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-gray-600 text-sm mb-2">Average Expense</p>
              <p className="text-3xl font-bold text-gray-900">
                KES{" "}
                {(stats.total / (stats.count || 1)).toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="text-xs text-gray-500 mt-2">Per transaction</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-gray-600 text-sm mb-2">Top Category</p>
              <p className="text-3xl font-bold text-gray-900 capitalize">
                {topCategories[0]?.category || "N/A"}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                KES {topCategories[0]?.amount.toLocaleString() || "0"}
              </p>
            </div>
          </div>

          {/* Add Expense Form */}
          {showForm && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                New Expense
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">
                    Amount (KES)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="5000"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-700 text-sm font-medium mb-2 block">
                    Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Office supplies"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAddExpense}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
                >
                  Save Expense
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-5 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              All Expenses
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize whitespace-nowrap ${
                  filter === cat
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Expenses List */}
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              </div>
            ) : filteredExpenses.length === 0 ? (
              <div className="text-center py-12 bg-white border border-gray-200 rounded-2xl">
                <p className="text-gray-500 text-sm">
                  {filter === "all"
                    ? "No expenses yet. Add one to get started!"
                    : `No ${filter} expenses found.`}
                </p>
              </div>
            ) : (
              filteredExpenses.map((expense) => (
                <div
                  key={expense._id}
                  className="bg-white border border-gray-200 rounded-2xl px-6 py-4 flex items-center justify-between hover:shadow-sm transition"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`p-3 rounded-lg ${
                        categoryColors[expense.category]
                      }`}
                    >
                      {categoryIcons[expense.category]}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-semibold text-sm">
                        {expense.description || "No description"}
                      </p>
                      <p className="text-gray-500 text-xs capitalize">
                        {expense.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <p className="text-gray-900 font-semibold whitespace-nowrap">
                      KES {expense.amount?.toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleDelete(expense._id)}
                      className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition border border-gray-200"
                      title="Delete expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Category Breakdown */}
          {expenses.length > 0 && (
            <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Breakdown by Category
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.byCategory
                  .filter((item) => item.amount > 0)
                  .map((item) => (
                    <div
                      key={item.category}
                      className="p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`p-2 rounded-lg ${categoryColors[item.category]}`}
                        >
                          {categoryIcons[item.category]}
                        </div>
                        <div>
                          <p className="text-gray-900 font-semibold text-sm capitalize">
                            {item.category}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {item.count} expenses
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-900 font-bold">
                        KES {item.amount.toLocaleString()}
                      </p>
                      <div className="mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{
                            width: `${(item.amount / stats.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {((item.amount / stats.total) * 100).toFixed(1)}% of
                        total
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Expenses;
