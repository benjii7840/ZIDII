import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full py-4 px-6 flex items-center justify-between bg-white border-rounded-md">
      {/* Logo */}
      <h1 className="text-xl font-semibold text-gray-800">ZIDI</h1>

      {/* Links */}
      <div className="hidden md:flex gap-8 text-gray-600">
        <Link to="/" className="hover:text-black">
          Home
        </Link>
        <Link to="/about" className="hover:text-black">
          About
        </Link>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="bg-black text-white px-5 py-2 rounded-full text-sm hover:bg-blue-600"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-black text-white px-5 py-2 rounded-full text-sm hover:bg-green-600"
        >
          Create Account
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
