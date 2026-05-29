import React from "react";

const Navbar = () => {
  return (
    <div>
      <nav className="sticky top-0 backdrop-filter backdrop-blur-lg bg-white/30 border-b border-white/20 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"></div>
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Navbar.Brand />
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a
                href="/"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </a>
              <a
                href="/about"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                About
              </a>
              <a
                href="/contact"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
