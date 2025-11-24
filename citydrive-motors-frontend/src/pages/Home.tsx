// src/pages/Home.tsx
import { useCars } from '../hooks/useCars';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Home() {
  const { user, logout } = useAuth();
  const { data: cars, isLoading } = useCars();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-lg p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">CityDrive Motors</h1>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <span className="text-gray-700 font-medium">Hi, {user.email}!</span>
                <Link to="/my-cars" className="text-blue-600 font-semibold hover:underline">
                  My Listings
                </Link>
                <Link
                  to="/add-car"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  + Sell Car
                </Link>
                <button onClick={logout} className="text-red-600 font-semibold hover:underline">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-blue-600 font-semibold hover:underline">
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
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">Find Your Perfect Ride</h2>
          <p className="text-xl text-gray-600">Browse hundreds of verified used cars</p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-600">Loading cars...</p>
          </div>
        ) : cars && cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {cars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full"
              >
                {/* REAL IMAGE DISPLAY */}
                {car.images && car.images.length > 0 ? (
                  <img
                    src={`http://localhost:3000${car.images[0]}`}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-car.jpg'; // optional fallback
                    }}
                  />
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed w-full h-48 flex items-center justify-center text-gray-500 text-sm">
                    No Image
                  </div>
                )}

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                    {car.year} {car.brand} {car.model}
                  </h3>

                  <p className="text-3xl font-bold text-blue-600 mt-3">
                    PKR {(car.price / 100).toLocaleString()}
                  </p>

                  <p className="text-gray-600 mt-1">{car.mileage.toLocaleString()} km</p>

                  {car.description ? (
                    <p className="text-gray-500 text-sm mt-4 line-clamp-2 flex-1">
                      {car.description}
                    </p>
                  ) : (
                    <div className="flex-1" />
                  )}

                  <p className="text-sm text-gray-500 mt-4">
                    Listed by: {car.owner?.email?.split('@')[0] || 'Unknown'}
                  </p>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <Link
                      to={`/car/${car.id}`}
                      className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition text-lg"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-3xl text-gray-600">No cars listed yet.</p>
            {user && (
              <Link
                to="/add-car"
                className="mt-8 inline-block bg-green-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-green-700"
              >
                Be the first to sell!
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}