import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleRegister() {
    if (!name || !email || !password || !businessName || !businessPhone)
      return setError("Please fill in all fields");

    setLoading(true);
    setError("");

    const data = await api.post("/api/auth/register", {
      name,
      email,
      password,
      businessName,
      businessPhone,
    });

    if (data.token) {
      login(data.token);
      navigate("/dashboard");
    } else {
      setError(data.message || "Registration failed");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Zidi</h1>
          <p className="text-gray-400">Create your business account</p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-4">
            {[
              {
                label: "Full Name",
                value: name,
                setter: setName,
                placeholder: "Benjamin Baraza",
                type: "text",
              },
              {
                label: "Email",
                value: email,
                setter: setEmail,
                placeholder: "you@business.com",
                type: "email",
              },
              {
                label: "Password",
                value: password,
                setter: setPassword,
                placeholder: "••••••••",
                type: "password",
              },
              {
                label: "Business Name",
                value: businessName,
                setter: setBusinessName,
                placeholder: "Baraza Tech",
                type: "text",
              },
              {
                label: "Business Phone",
                value: businessPhone,
                setter: setBusinessPhone,
                placeholder: "0712345678",
                type: "tel",
              },
            ].map(({ label, value, setter, placeholder, type }) => (
              <div key={label}>
                <label className="text-sm text-gray-400 mb-1 block">
                  {label}
                </label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
                />
              </div>
            ))}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition mt-2 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>
          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-400 hover:text-purple-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
