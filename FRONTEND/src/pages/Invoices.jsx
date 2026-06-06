import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { api } from "../utils/api";
import { Download, Trash2, Plus } from "lucide-react";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/invoices").then((data) => {
      setInvoices(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      await api.delete(`/api/invoices/${id}`);
      setInvoices(invoices.filter((inv) => inv._id !== id));
    }
  }

  async function handleStatusChange(id, status) {
    const updated = await api.put(`/api/invoices/${id}`, { status });
    setInvoices(invoices.map((inv) => (inv._id === id ? updated : inv)));
  }

  function handleDownloadPDF(id) {
    const token = localStorage.getItem("token");
    window.open(
      `http://localhost:5002/api/invoices/${id}/pdf?token=${token}`,
      "_blank",
    );
  }

  const statusConfig = {
    draft: {
      label: "Draft",
      className: "bg-gray-100 text-gray-700 border border-gray-200",
    },
    sent: {
      label: "Sent",
      className: "bg-blue-100 text-blue-700 border border-blue-200",
    },
    paid: {
      label: "Paid",
      className: "bg-green-100 text-green-700 border border-green-200",
    },
  };

  const filteredInvoices =
    filter === "all"
      ? invoices
      : invoices.filter((inv) => inv.status === filter);

  const stats = {
    total: invoices.length,
    paid: invoices.filter((inv) => inv.status === "paid").length,
    pending: invoices.filter((inv) => inv.status !== "paid").length,
    totalAmount: invoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
              <p className="text-gray-500 mt-1">
                Manage and track your invoices
              </p>
            </div>
            <button
              onClick={() => navigate("/invoices/new")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-3 rounded-lg transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Invoice
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-gray-600 text-sm mb-2">Total Invoices</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-2">All time</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-gray-600 text-sm mb-2">Paid</p>
              <p className="text-3xl font-bold text-green-600">{stats.paid}</p>
              <p className="text-xs text-gray-500 mt-2">Completed</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-gray-600 text-sm mb-2">Pending</p>
              <p className="text-3xl font-bold text-amber-600">
                {stats.pending}
              </p>
              <p className="text-xs text-gray-500 mt-2">Awaiting payment</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-gray-600 text-sm mb-2">Total Amount</p>
              <p className="text-3xl font-bold text-gray-900">
                KES {(stats.totalAmount / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-gray-500 mt-2">All invoices</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-3 mb-6">
            {[
              { value: "all", label: "All Invoices" },
              { value: "draft", label: "Drafts" },
              { value: "sent", label: "Sent" },
              { value: "paid", label: "Paid" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === tab.value
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Invoices Table */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left text-gray-700 text-sm font-semibold px-6 py-4">
                    Client
                  </th>
                  <th className="text-left text-gray-700 text-sm font-semibold px-6 py-4">
                    Amount
                  </th>
                  <th className="text-left text-gray-700 text-sm font-semibold px-6 py-4">
                    Status
                  </th>
                  <th className="text-left text-gray-700 text-sm font-semibold px-6 py-4">
                    Due Date
                  </th>
                  <th className="text-right text-gray-700 text-sm font-semibold px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-500 py-12">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <p className="text-gray-500 text-sm">
                        {filter === "all"
                          ? "No invoices yet. Create your first one!"
                          : `No ${filter} invoices found.`}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <tr
                      key={invoice._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <p className="text-gray-900 font-semibold text-sm">
                          {invoice.clientName}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {invoice.clientEmail}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900 font-semibold text-sm">
                          KES {invoice.total?.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={invoice.status}
                          onChange={(e) =>
                            handleStatusChange(invoice._id, e.target.value)
                          }
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg border bg-white cursor-pointer transition ${
                            statusConfig[invoice.status].className
                          }`}
                        >
                          <option value="draft">Draft</option>
                          <option value="sent">Sent</option>
                          <option value="paid">Paid</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600 text-sm">
                          {invoice.dueDate
                            ? new Date(invoice.dueDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "--"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDownloadPDF(invoice._id)}
                            className="p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition border border-gray-200"
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(invoice._id)}
                            className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition border border-gray-200"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Info */}
          {filteredInvoices.length > 0 && (
            <div className="mt-6 text-right text-sm text-gray-600">
              Showing {filteredInvoices.length} of {invoices.length} invoices
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Invoices;
