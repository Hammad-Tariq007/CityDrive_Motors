// src/pages/MyListings.tsx
import { Link } from "react-router-dom";
import { useMyCars } from "../hooks/useCars";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function MyListings() {
  const { user, logout } = useAuth();
  const { data: cars, isLoading } = useMyCars();
  const queryClient = useQueryClient();

  // DELETE MUTATION — ONLY OWNER CAN DELETE (backend protected)
  const deleteMutation = useMutation({
    mutationFn: (carId: string) => api.delete(`/cars/${carId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-cars"] });
      queryClient.invalidateQueries({ queryKey: ["cars"] }); // also update home page
      toast.success("Car deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete car");
    },
  });

  const handleDelete = (carId: string, carTitle: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${carTitle}"? This cannot be undone.`
      )
    ) {
      deleteMutation.mutate(carId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
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
                  <Link
                    to="/add-car"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition"
                  >
                    + Sell Car
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
                  <Link to="/login" className="text-blue-600 font-semibold">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-10">My Listings</h1>

        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-600">Loading your cars...</p>
          </div>
        ) : cars && cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {cars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full"
              >
                {/* REAL IMAGE — SAME AS HOME PAGE */}
                {car.images && car.images.length > 0 ? (
                  <img
                    src={`http://localhost:3000${car.images[0]}`}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/placeholder-car.jpg";
                    }}
                  />
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed w-full h-48 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                    {car.year} {car.brand} {car.model}
                  </h3>

                  <p className="text-3xl font-bold text-blue-600 mt-3">
                    PKR {(car.price / 100).toLocaleString()}
                  </p>

                  <p className="text-gray-600 mt-1">
                    {car.mileage.toLocaleString()} km
                  </p>

                  {car.description && (
                    <p className="text-gray-500 text-sm mt-4 line-clamp-2 flex-1">
                      {car.description}
                    </p>
                  )}

                  {/* BUTTONS */}
                  <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
                    <Link
                      to={`/car/${car.id}`}
                      className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                    >
                      View Details
                    </Link>

                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to={`/edit-car/${car.id}`}
                        className="block text-center bg-amber-600 text-white py-3 rounded-lg font-bold hover:bg-amber-700 transition"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(
                            car.id,
                            `${car.year} ${car.brand} ${car.model}`
                          )
                        }
                        disabled={deleteMutation.isPending}
                        className="bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 disabled:bg-red-400 transition"
                      >
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
            <p className="text-3xl text-gray-600 mb-8">
              You haven't listed any cars yet.
            </p>
            <Link
              to="/add-car"
              className="inline-block bg-green-600 text-white px-10 py-5 rounded-xl text-xl font-bold hover:bg-green-700 transition shadow-lg"
            >
              + Sell Your First Car
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
