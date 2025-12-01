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
        error.response?.data?.message || error.message || "Failed to post remark"
      );
    },
  });

  if (carLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center py-32">
          <p className="text-3xl text-gray-600">Loading car details...</p>
        </div>
      </div>
    );
  if (!car)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center py-32">
          <p className="text-3xl text-red-600">Car not found</p>
        </div>
      </div>
    );

  const handlePost = () => {
    if (remark.trim()) addRemark.mutate(remark);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Sticky Nav */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold text-blue-600 hover:text-blue-700 transition">
            CityDrive Motors
          </Link>
          <div className="flex gap-6 items-center">
            <Link to="/" className="text-blue-600 font-bold hover:underline transition">
              ← All Cars
            </Link>
            {user && (
              <Link
                to="/my-cars"
                className="text-blue-600 font-bold hover:underline transition"
              >
                My Listings
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        {/* HERO SECTION — Immersive Image + Overlay Details (Like Your Screenshot) */}
        <div className="relative bg-gradient-to-r from-black/20 to-transparent rounded-3xl overflow-hidden shadow-2xl mb-16">
          {/* Hero Image */}
          <img
            src={car.images?.[0] || "https://via.placeholder.com/1200x600/1a1a1a/ffffff?text=No+Image"}
            alt={`${car.year} ${car.brand} ${car.model}`}
            className="w-full h-[500px] object-cover"
            loading="eager" // Priority for hero
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/1200x600/1a1a1a/ffffff?text=Car+Image+Unavailable";
            }}
          />
          
          {/* Overlay Details — Positioned Over Image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
            <div className="text-white max-w-md">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                {car.year} {car.brand} {car.model}
              </h1>
              <p className="text-5xl md:text-7xl font-black text-green-400 mb-6 drop-shadow-2xl">
                PKR {(car.price / 100).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* SPECIFICATIONS & DESCRIPTION — Clean Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Specs Column */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
              Specifications
            </h2>
            <div className="space-y-6 text-xl">
              <div className="flex justify-between">
                <span className="text-gray-600">Mileage</span>
                <span className="font-semibold">{car.mileage.toLocaleString()} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Year</span>
                <span className="font-semibold">{car.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Listed By</span>
                <span className="font-semibold">{car.owner?.email || "Private Seller"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-semibold">
                  {format(new Date(car.createdAt), "dd MMM yyyy")}
                </span>
              </div>
              {car.isSold && (
                <div className="flex justify-between bg-red-50 p-3 rounded-xl">
                  <span className="text-red-600">Status</span>
                  <span className="font-bold text-red-600">SOLD</span>
                </div>
              )}
            </div>
          </div>

          {/* Description Column */}
          {car.description ? (
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-4">
                Description
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                {car.description}
              </p>
            </div>
          ) : null}
        </div>

        {/* IMAGE GALLERY — Modern Thumbnails */}
        {car.images && car.images.length > 1 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {car.images.slice(1).map((url: string, index: number) => (
                <img
                  key={index}
                  src={url}
                  alt={`Additional car image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-xl hover:shadow-lg transition-shadow cursor-pointer"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/300x200/1e293b/ffffff?text=Gallery+Image";
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* REMARKS SECTION — Clean Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <h2 className="text-4xl font-bold mb-10 text-gray-800">
            Remarks ({remarks.length})
          </h2>

          {user ? (
            <div className="flex gap-4 mb-12 p-4 bg-blue-50 rounded-2xl">
              <input
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  !addRemark.isPending &&
                  remark.trim() &&
                  handlePost()
                }
                placeholder="Share your thoughts on this car..."
                className="flex-1 px-6 py-4 border-2 border-blue-200 rounded-xl text-lg focus:border-blue-500 outline-none transition bg-white"
              />
              <button
                onClick={handlePost}
                disabled={addRemark.isPending || !remark.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-10 py-4 rounded-xl font-bold text-lg transition shadow-lg"
              >
                {addRemark.isPending ? "Posting..." : "Post Remark"}
              </button>
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-2xl mb-8">
              <p className="text-xl text-gray-600 mb-4">
                <Link to="/login" className="text-blue-600 font-bold underline hover:text-blue-700">
                  Log in
                </Link>{" "}
                to leave a remark and join the conversation!
              </p>
            </div>
          )}

          {remarksLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading remarks...</p>
            </div>
          ) : remarks.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <p className="text-xl text-gray-500">No remarks yet. Be the first to share!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {remarks.map((r: any) => (
                <div
                  key={r.id}
                  className="bg-gray-50 p-6 rounded-2xl border border-gray-200 hover:bg-gray-100 transition"
                >
                  <p className="text-lg font-medium text-gray-800 mb-3">
                    {r.content}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>
                      —{" "}
                      <span className="font-medium text-gray-700">
                        {r.user?.name ||
                          r.user?.email?.split("@")[0] ||
                          "Anonymous"}
                      </span>
                    </span>
                    <span>{format(new Date(r.createdAt), "dd MMM yyyy - HH:mm")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}