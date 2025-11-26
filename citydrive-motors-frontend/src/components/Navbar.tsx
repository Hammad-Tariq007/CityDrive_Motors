import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isMyListings = location.pathname === "/my-cars";

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-3xl font-bold text-blue-600">
            CityDrive Motors
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <span className="text-gray-700 font-medium">
                  Hi, {user.email.split("@")[0]}!
                </span>

                {isMyListings ? (
                  <Link
                    to="/"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    ← Back to Home
                  </Link>
                ) : (
                  <Link
                    to="/my-cars"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    My Listings
                  </Link>
                )}

                <Link
                  to="/add-car"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  Sell Car
                </Link>

                <button
                  onClick={logout}
                  className="text-red-600 font-semibold hover:underline"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
