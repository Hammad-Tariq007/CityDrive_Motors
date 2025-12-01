import { Link } from "react-router-dom";
import type { Car } from "../types/car";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full">
      {/* MAIN IMAGE — NOW USES CLOUDINARY URL DIRECTLY */}
      {car.images && car.images.length > 0 ? (
        <img
          src={car.images[0]}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-48 object-cover"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/600x400/1e293b/ffffff?text=No+Image";
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
        <p className="text-gray-600 mt-1">{car.mileage.toLocaleString()} km</p>

        {car.description && (
          <p className="text-gray-500 text-sm mt-4 line-clamp-2 flex-1">
            {car.description}
          </p>
        )}

        <p className="text-sm text-gray-500 mt-4">
          Listed by: {car.owner?.email?.split("@")[0] || "Unknown"}
        </p>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <Link
            to={`/car/${car.id}`}
            className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
