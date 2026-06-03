import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="w-full min-h-[90vh] bg-gradient-to-r from-[#eef2f7] to-[#f4d6cf] rounded-3xl px-5 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between">
      {/* LEFT SIDE */}
      <div className="max-w-xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full text-sm mb-6">
          🔥 #1 best invoice management generator
        </div>

        {/* Heading */}
        <h1 className="text-xl md:text-5xl font-medium text-gray-800 leading-tight">
          The Best Invoice <br />
          Management <br />
          Generator for You
        </h1>

        {/* Description */}
        <p className="text-gray-500 mt-4">
          Zidi is the best invoice management software for small businesses. It
          helps you create and send professional invoices in minutes, track
          payments, and manage your finances with ease.
        </p>

        {/* Button */}
        <Link
          to="/register"
          className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-full"
        >
          Get Started
        </Link>
      </div>

      {/* RIGHT SIDE (IMAGE) */}
      <div className="mt-10 md:mt-0">
        {/* 👉 PUT YOUR IMAGE URL HERE */}
        <img
          src="/images/invoice.webp"
          alt="doctor"
          className="w-[300px] md:w-[400px] object-contain"
        />
      </div>
    </section>
  );
};

export default Hero;
