import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Hero() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const scrollToCars = (e: React.MouseEvent) => {
    e.preventDefault();
    const carsSection = document.getElementById("cars-section");
    carsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSellCarClick = () => {
    if (user) {
      navigate("/add-car");
    } else {
      navigate("/login", { state: { from: "/add-car" } });
    }
  };

  return (
    <div
      className="relative h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80')",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60" />

      <div className="relative max-w-7xl mx-auto px-8 h-full flex items-center">
        <div className="text-white max-w-3xl">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            Find Your <span className="text-blue-400">Dream Car</span>
          </h1>
          <p className="text-2xl md:text-3xl mb-10 text-gray-200">
            Thousands of verified new and used cars from trusted sellers across Pakistan
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <button
              onClick={scrollToCars}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-xl text-xl font-bold transition transform hover:scale-105 shadow-2xl"
            >
              Browse Cars
            </button>

            <button
              onClick={handleSellCarClick}
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-xl text-xl font-bold transition transform hover:scale-105 shadow-2xl text-center"
            >
              Sell Your Car
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button onClick={scrollToCars} className="text-white">
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
