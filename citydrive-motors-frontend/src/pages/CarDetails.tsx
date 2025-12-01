import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useState } from "react";

export default function CarDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [remark, setRemark] = useState("");

  const { data: car, isLoading: carLoading } = useQuery({
    queryKey: ["car", id],
    queryFn: async () => (await api.get(`/cars/${id}`)).data,
  });

  const { data: remarks = [], isLoading: remarksLoading } = useQuery({
    queryKey: ["remarks", id],
    queryFn: async () => (await api.get(`/cars/${id}/remarks`)).data,
  });

  const addRemark = useMutation({
    mutationFn: async (text: string) => {
      if (!text.trim()) throw new Error("Remark cannot be empty");
      return api.post(`/cars/${id}/remarks`, { content: text.trim() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["remarks", id] });
      setRemark("");
      toast.success("Remark posted successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to post remark"
      );
    },
  });

  if (carLoading)
    return <div className="text-center py-32 text-3xl">Loading car...</div>;
  if (!car)
    return (
      <div className="text-center py-32 text-3xl text-red-600">
        Car not found
      </div>
    );

  const handlePost = () => {
    if (remark.trim()) addRemark.mutate(remark);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold text-blue-600">
            CityDrive Motors
          </Link>
          <div className="flex gap-6 items-center">
            <Link to="/" className="text-blue-600 font-bold hover:underline">
              ← All Cars
            </Link>
            {user && (
              <Link
                to="/my-cars"
                className="text-blue-600 font-bold hover:underline"
              >
                My Listings
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        {/* HERO SECTION — IMAGE + DETAILS SIDE BY SIDE */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16">
          <div className="grid md:grid-cols-2 gap-0">
            {/* IMAGE — FULL HEIGHT, ROUNDED CORNERS */}
            <div className="relative bg-gray-900">
              {car.images && car.images.length > 0 ? (
                <img
                  src={car.images[0]}
                  alt={`${car.year} ${car.brand} ${car.model}`}
                  className="w-full h-full min-h-96 object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/1200x800/1a1a1a/ffffff?text=No+Image";
                  }}
                />
              ) : (
                <div className="w-full h-full min-h-96 bg-gray-200 border-2 border-dashed flex items-center justify-center text-4xl text-gray-500">
                  No Image
                </div>
              )}
            </div>

            {/* DETAILS */}
            <div className="p-12 flex flex-col justify-center">
              <h1 className="text-5xl font-bold text-gray-800">
                {car.year} {car.brand} {car.model}
              </h1>
              <p className="text-6xl font-bold text-green-600 mt-6">
                PKR {(car.price / 100).toLocaleString()}
              </p>

              <div className="mt-10 space-y-6 text-xl">
                <p>
                  <strong>Mileage:</strong> {car.mileage.toLocaleString()} km
                </p>
                <p>
                  <strong>Listed by:</strong> {car.owner?.email || "Unknown"}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {format(new Date(car.createdAt), "dd MMM yyyy")}
                </p>
              </div>

              {car.description && (
                <div className="mt-12 bg-gray-100 p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    Description
                  </h3>
                  <p className="text-lg leading-relaxed text-gray-700">
                    {car.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* REMARKS SECTION */}
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <h2 className="text-4xl font-bold mb-10">
            Remarks ({remarks.length})
          </h2>

          {user ? (
            <div className="flex gap-4 mb-12">
              <input
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  !addRemark.isPending &&
                  remark.trim() &&
                  handlePost()
                }
                placeholder="Write your remark here..."
                className="flex-1 px-6 py-5 border-2 border-gray-300 rounded-xl text-lg focus:border-blue-500 outline-none transition"
              />
              <button
                onClick={handlePost}
                disabled={addRemark.isPending || !remark.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-10 py-5 rounded-xl font-bold text-lg transition"
              >
                {addRemark.isPending ? "Posting..." : "Post"}
              </button>
            </div>
          ) : (
            <p className="text-center py-10 text-xl text-gray-600">
              <Link to="/login" className="text-blue-600 font-bold underline">
                Login
              </Link>{" "}
              to leave a remark
            </p>
          )}

          {remarksLoading ? (
            <p className="text-center text-gray-500 py-8">Loading remarks...</p>
          ) : remarks.length === 0 ? (
            <p className="text-center text-gray-500 text-xl py-16">
              No remarks yet. Be the first!
            </p>
          ) : (
            <div className="space-y-6">
              {remarks.map((r: any) => (
                <div
                  key={r.id}
                  className="bg-gray-50 p-6 rounded-2xl border border-gray-200"
                >
                  <p className="text-lg font-medium text-gray-800">
                    {r.content}
                  </p>
                  <p className="text-sm text-gray-500 mt-3">
                    —{" "}
                    <span className="font-medium text-gray-700">
                      {r.user?.name ||
                        r.user?.email?.split("@")[0] ||
                        "Anonymous"}
                    </span>{" "}
                    • {format(new Date(r.createdAt), "dd MMM yyyy - HH:mm")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
