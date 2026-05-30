import Navbar from "../components/Navbar";
const Landing = () => {
  return (
    <div>
      <Navbar />
      <main>
        <section className="py-20 text-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-center">
              Welcome to Our App
            </h1>
            <p className="text-lg text-center mt-4">
              Discover the amazing features of our application.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
