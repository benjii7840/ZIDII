import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { api } from "../utils/api.js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StatCard = ({
  label,
  value,
  prefix = "KES",
  color = "text-white",
  trend = "+15.9%",
  description = "",
}) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
    <p className="text-gray-600 text-sm mb-2">{label}</p>
    <p className={`text-3xl font-bold text-gray-900 mb-3`}>
      {value?.toLocaleString() ?? "--"}
    </p>
    <div className="flex justify-between items-center">
      <p className="text-xs text-gray-500">{description}</p>
      <span className="text-xs font-semibold text-green-600">↑ {trend}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [weights, setWeights] = useState([]);

  useEffect(() => {
    api.get("/api/dashboard").then(setStats);
  }, []);

  const mockChartData = [
    { time: "10am", onTime: 65, onLate: 20 },
    { time: "11am", onTime: 55, onLate: 25 },
    { time: "12am", onTime: 70, onLate: 15 },
    { time: "1am", onTime: 60, onLate: 30 },
    { time: "2am", onTime: 65, onLate: 25 },
    { time: "3am", onTime: 55, onLate: 35 },
    { time: "4am", onTime: 75, onLate: 10 },
    { time: "5am", onTime: 50, onLate: 40 },
    { time: "6am", onTime: 70, onLate: 20 },
    { time: "7am", onTime: 65, onLate: 25 },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Total Revenue"
              value={stats?.totalRevenue}
              trend="15.9%"
              description="Stay informed with real-time data"
            />
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-gray-600 text-sm mb-2">Total Expenses</p>
              <p className="text-3xl font-bold text-gray-900 mb-3">
                {stats?.totalExpenses?.toLocaleString() ?? "--"}
              </p>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  Stay updated with essential details
                </p>
                <span className="text-xs font-semibold text-green-600">
                  ↑ 15.9%
                </span>
              </div>
            </div>
            <StatCard
              label="Profit"
              value={stats?.profit}
              trend={stats?.profit >= 0 ? "15.9%" : "-5.2%"}
              description="Monitor your profit margin"
            />
            <StatCard
              label="Outstanding Invoices"
              value={stats?.outstandingCount}
              prefix=""
              trend="Unpaid"
              description={`KES ${stats?.outstandingAmount?.toLocaleString() ?? "--"}`}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Overview Chart */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Patient Overview
                </h3>
                <button className="text-gray-400 hover:text-gray-600 transition">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
              </div>

              <div className="flex gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600">On Time</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-pink-300"></div>
                  <span className="text-sm text-gray-600">On Late</span>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={mockChartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="onTime"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="onLate"
                    stroke="#fbcfe8"
                    strokeWidth={2}
                    dot={{ fill: "#fbcfe8", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Summary
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-500 text-xs mb-1">
                    Total Active Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.totalRevenue?.toLocaleString() ?? "--"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Performance</p>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
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
