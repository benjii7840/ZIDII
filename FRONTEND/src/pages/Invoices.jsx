import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { api } from "../utils/api";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/invoices").then((data) => {
      setInvoices(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  async function handleDelete(id) {
    await api.delete(`/api/invoices/${id}`);
    setInvoices(invoices.filter((inv) => inv._id !== id));
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

  const statusColor = {
    draft: "text-gray-400 bg-gray-500/10 border-gray-500/20",
    sent: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    paid: "text-green-400 bg-green-500/10 border-green-500/20",
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Invoices</h1>
          <button
            onClick={() => navigate("/invoices/new")}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
          >
            + New Invoice
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">
                  Client
                </th>
                <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">
                  Amount
                </th>
                <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">
                  Status
                </th>
                <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">
                  Due Date
                </th>
                <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-12">
                    Loading...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-12">
                    No invoices yet. Create your first one!
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr
                    key={invoice._id}
                    className="border-b border-white/5 hover:bg-white/3 transition"
                  >
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">
                        {invoice.clientName}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {invoice.clientEmail}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      KES {invoice.total?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={invoice.status}
                        onChange={(e) =>
                          handleStatusChange(invoice._id, e.target.value)
                        }
                        className={`text-xs font-medium px-3 py-1 rounded-full border bg-transparent cursor-pointer ${statusColor[invoice.status]}`}
                      >
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="paid">Paid</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {invoice.dueDate
                        ? new Date(invoice.dueDate).toLocaleDateString()
                        : "--"}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <button
                        onClick={() => handleDownloadPDF(invoice._id)}
                        className="text-gray-400 hover:text-purple-400 text-xs font-medium px-3 py-1 transition rounded-full border bg-transparent p-4"
                      >
                        PDF
                      </button>
                      <button
                        onClick={() => handleDelete(invoice._id)}
                        className="text-gray-400 hover:text-red-400 text-xs font-medium px-3 py-1 transition rounded-full border bg-transparent p-4 "
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Invoices;
