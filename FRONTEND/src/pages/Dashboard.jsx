import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { api } from "../utils/api.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, DollarSign, FileText } from "lucide-react";

const StatCard = ({
  label,
  value,
  prefix = "KES",
  trend = "+15.9%",
  description = "",
  icon: Icon,
}) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-2">
      <p className="text-gray-600 text-sm">{label}</p>
      {Icon && <Icon className="w-5 h-5 text-gray-400" />}
    </div>
    <p className="text-3xl font-bold text-gray-900 mb-3">
      {value?.toLocaleString() ?? "--"}
    </p>
    <div className="flex justify-between items-center">
      <p className="text-xs text-gray-500">{description}</p>
      <span
        className={`text-xs font-semibold ${
          trend.includes("-") ? "text-red-600" : "text-green-600"
        }`}
      >
        {trend}
      </span>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    api.get("/api/dashboard").then(setStats);
    api.get("/api/invoices").then((data) => {
      setInvoices(Array.isArray(data) ? data : []);
    });
    api.get("/api/expenses").then((data) => {
      setExpenses(Array.isArray(data) ? data : []);
    });
  }, []);

  // Calculate totals from actual data
  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const profit = totalRevenue - totalExpenses;
  const paidInvoices = invoices.filter((inv) => inv.status === "paid").length;
  const sentInvoices = invoices.filter((inv) => inv.status === "sent").length;
  const draftInvoices = invoices.filter((inv) => inv.status === "draft").length;
  const pendingInvoices = sentInvoices + draftInvoices;

  // Build expense categories from actual data
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const existing = acc.find((cat) => cat.category === expense.category);
    if (existing) {
      existing.amount += expense.amount;
      existing.count += 1;
    } else {
      acc.push({
        category:
          expense.category.charAt(0).toUpperCase() + expense.category.slice(1),
        amount: expense.amount,
        count: 1,
      });
    }
    return acc;
  }, []);

  // Invoice Status Data
  const invoiceStatusData = [
    { name: "Paid", value: paidInvoices, color: "#10b981" },
    { name: "Sent", value: sentInvoices, color: "#3b82f6" },
    { name: "Draft", value: draftInvoices, color: "#9ca3af" },
  ].filter((item) => item.value > 0);

  // Revenue vs Expenses by month (from actual invoices/expenses)
  const monthlyData = invoices.reduce((acc, invoice) => {
    const month = new Date(invoice.createdAt || new Date()).toLocaleDateString(
      "en-US",
      { month: "short" },
    );
    const existing = acc.find((m) => m.month === month);

    if (existing) {
      existing.revenue += invoice.total || 0;
    } else {
      acc.push({
        month,
        revenue: invoice.total || 0,
        expenses: 0,
      });
    }
    return acc;
  }, []);

  expenses.forEach((expense) => {
    const month = new Date(expense.createdAt || new Date()).toLocaleDateString(
      "en-US",
      { month: "short" },
    );
    const existing = monthlyData.find((m) => m.month === month);
    if (existing) {
      existing.expenses += expense.amount;
    } else {
      monthlyData.push({
        month,
        revenue: 0,
        expenses: expense.amount,
      });
    }
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back to ZIDI</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-8">
            <StatCard
              label="Total Revenue"
              value={totalRevenue}
              trend={invoices.length > 0 ? "+12.5%" : "No data"}
              description="All invoices"
              icon={TrendingUp}
            />
            <StatCard
              label="Total Expenses"
              value={totalExpenses}
              trend={expenses.length > 0 ? "+8.2%" : "No data"}
              description="All spending"
              icon={DollarSign}
            />
            <StatCard
              label="Profit"
              value={profit}
              trend={profit >= 0 ? "+15.9%" : "-5.2%"}
              description="Revenue minus expenses"
            />
            <StatCard
              label="Invoices"
              value={invoices.length}
              prefix=""
              trend={`${paidInvoices} paid`}
              description={`${pendingInvoices} pending`}
              icon={FileText}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue vs Expenses Chart */}
            {monthlyData.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Revenue vs Expenses
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      stroke="#9ca3af"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      fill="#3b82f6"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="expenses"
                      fill="#ef4444"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-center h-80">
                <p className="text-gray-500">
                  No data yet. Create invoices or add expenses.
                </p>
              </div>
            )}

            {/* Invoice Status Chart */}
            {invoiceStatusData.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Invoice Status
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={invoiceStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {invoiceStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-6 space-y-2">
                  {invoiceStatusData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-center h-80">
                <p className="text-gray-500">No invoices yet.</p>
              </div>
            )}
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Expenses Categories */}
            {expensesByCategory.length > 0 ? (
              <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Expenses by Category
                </h3>
                <div className="space-y-3">
                  {expensesByCategory
                    .sort((a, b) => b.amount - a.amount)
                    .map((item, idx) => {
                      const max = Math.max(
                        ...expensesByCategory.map((e) => e.amount),
                      );
                      return (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">
                              {item.category}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              KES {item.amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{
                                width: `${(item.amount / max) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.count} transaction{item.count > 1 ? "s" : ""}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-center">
                <p className="text-gray-500">No expenses yet.</p>
              </div>
            )}

            {/* Quick Insights */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Insights
              </h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-sm text-gray-600">Profit Margin</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {totalRevenue > 0
                      ? ((profit / totalRevenue) * 100).toFixed(1)
                      : "0"}
                    %
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-sm text-gray-600">Avg Invoice Value</p>
                  <p className="text-2xl font-bold text-blue-600">
                    KES{" "}
                    {invoices.length > 0
                      ? Math.round(
                          totalRevenue / invoices.length,
                        ).toLocaleString()
                      : "0"}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-sm text-gray-600">Collection Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {invoices.length > 0
                      ? Math.round((paidInvoices / invoices.length) * 100)
                      : "0"}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
