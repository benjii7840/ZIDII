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
    if (!name || !email || !password || !businessName || !businessPhone) {
      return setError("Please fill in all fields");
    }

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
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* LEFT SIDE */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 py-10 bg-gradient-to-r from-[#eef2f7] to-[#f4d6cf]">
        {/* Logo */}
        <h1 className="text-xl font-semibold mb-6">ZIDI</h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800">
          Create your business account
        </h2>

        <p className="text-gray-500 mt-2 mb-6">
          Start managing your business in minutes.
        </p>

        {/* Error */}
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

        {/* Form */}
        <div className="space-y-4 max-w-md">
          {[
            {
              label: "Full Name",
              value: name,
              setter: setName,
              placeholder: "John Doe",
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
              placeholder: "Google Tech",
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
              <label className="text-sm text-gray-600">{label}</label>
              <input
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                className="w-full mt-1 p-3 border rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          ))}

          {/* Button */}
          <Link
            to="/dashboard"
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700 transition"
          >
            {loading ? "Creating account..." : "Create Account"}
          </Link>

          {/* Login link */}
          <p className="text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden md:flex flex-1 bg-gradient-to-r from-[#eef2f7] to-[#f4d6cf] text-white items-center justify-center p-10">
        <div className="max-w-md">
          <h2 className="text-3xl font-semibold mb-4 text-black/80">
            Effortlessly manage your team and operations.
          </h2>

          <p className="text-black/80 mb-6">
            Log in to access your dashboard and manage your business.
          </p>

          {/* 👉 PUT YOUR IMAGE URL HERE */}
          <img
            src="/images/invoice.webp"
            alt="dashboard"
            className="rounded-xl shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
