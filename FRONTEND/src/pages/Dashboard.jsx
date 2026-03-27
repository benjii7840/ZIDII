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

const StatCard = ({ label, value, prefix = "KES", color = "text-white" }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
    <p className="text-gray-400 text-sm mb-2">{label}</p>
    <p className={`text-3xl font-bold ${color}`}>
      {prefix} {value?.toLocaleString() ?? "--"}
    </p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [weights, setWeights] = useState([]);

  useEffect(() => {
    api.get("/api/dashboard").then(setStats);
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <StatCard
            label="Total Revenue"
            value={stats?.totalRevenue}
            color="text-green-400"
          />
          <StatCard
            label="Total Expenses"
            value={stats?.totalExpenses}
            color="text-red-400"
          />
          <StatCard
            label="Profit"
            value={stats?.profit}
            color={stats?.profit >= 0 ? "text-green-400" : "text-red-400"}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-gray-400 text-sm mb-2">Outstanding Invoices</p>
            <p className="text-3xl font-bold text-yellow-400">
              {stats?.outstandingCount ?? "--"}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              KES {stats?.outstandingAmount?.toLocaleString() ?? "--"} unpaid
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
