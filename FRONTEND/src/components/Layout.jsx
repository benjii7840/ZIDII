import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: "📊" },
  { path: "/invoices", label: "Invoices", icon: "📄" },
  { path: "/expenses", label: "Expenses", icon: "💰" },
  { path: "/ai", label: "AI Assistant", icon: "🤖" },
];

const Layout = ({ children }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <div className="w-64 bg-white/3 border-r border-white/10 flex flex-col fixed h-full">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold text-white">Zidi</h1>
          <p className="text-gray-500 text-xs mt-1">Business Finance</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                location.pathname === item.path
                  ? "bg-purple-600/20 text-purple-400 border border-purple-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-gray-400 hover:text-red-400 text-sm transition rounded-xl hover:bg-red-500/5"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 flex-1 flex flex-col">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
