// src/pages/AddCar.tsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function AddCar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    description: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    // === STRONG CLIENT-SIDE VALIDATION & CONVERSION ===
    const year = parseInt(formData.year, 10);
    const price = parseFloat(formData.price);
    const mileage = parseInt(formData.mileage, 10);

    if (!formData.title.trim()) return toast.error("Title is required") && setLoading(false);
    if (!formData.brand.trim()) return toast.error("Brand is required") && setLoading(false);
    if (!formData.model.trim()) return toast.error("Model is required") && setLoading(false);

    if (!formData.year || isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
      toast.error("Please enter a valid year");
      setLoading(false);
      return;
    }

    if (!formData.price || isNaN(price) || price < 10000) {
      toast.error("Please enter a valid price (min 10,000 PKR)");
      setLoading(false);
      return;
    }

    if (!formData.mileage || isNaN(mileage) || mileage < 0) {
      toast.error("Please enter a valid mileage");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("brand", formData.brand.trim());
      formDataToSend.append("model", formData.model.trim());
      formDataToSend.append("year", year.toString());
      formDataToSend.append("price", Math.round(price * 100).toString()); // in paisa
      formDataToSend.append("mileage", mileage.toString());
      if (formData.description.trim()) {
        formDataToSend.append("description", formData.description.trim());
      }

      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      await api.post("/cars", formDataToSend);

      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["my-cars"] });

      toast.success("Car listed successfully!");
      navigate("/my-cars");
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to list car";
      toast.error(Array.isArray(message) ? message.join(", ") : message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
            List Your Car for Sale
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Title (e.g. 2018 Honda Civic EX)"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Brand"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Model"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Year"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                required
                min="1900"
                max={new Date().getFullYear() + 1}
                step="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Price in PKR"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
                min="10000"
                step="1000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Mileage (km)"
                value={formData.mileage}
                onChange={(e) =>
                  setFormData({ ...formData, mileage: e.target.value })
                }
                required
                min="0"
                step="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            {/* IMAGE UPLOAD */}
            <div>
              <label className="block text-lg font-medium mb-3">
                Upload Images (up to 10)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />

              {previews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {previews.map((src, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={src}
                        alt="preview"
                        className="w-full h-40 object-cover rounded-lg shadow"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 rounded-lg font-bold text-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 transition-all shadow-lg"
            >
              {loading ? "Listing Your Car..." : "List Car for Sale"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}