import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function EditCar() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    description: '',
  });

  // Fetch the car data
  const { data: car, isLoading: carLoading } = useQuery({
    queryKey: ['car', id],
    queryFn: async () => (await api.get(`/cars/${id}`)).data,
  });

  // Prefill form with car data
  useEffect(() => {
    if (car) {
      setFormData({
        title: car.title,
        brand: car.brand,
        model: car.model,
        year: car.year.toString(),
        price: (car.price / 100).toString(),
        mileage: car.mileage.toString(),
        description: car.description || '',
      });
    }
  }, [car]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const priceInPaisa = Math.round(parseFloat(formData.price) * 100);

    if (isNaN(priceInPaisa) || priceInPaisa <= 0) {
      toast.error('Please enter a valid price');
      setLoading(false);
      return;
    }

    try {
      await api.patch(`/cars/${id}`, {
        title: formData.title.trim(),
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        year: parseInt(formData.year),
        price: priceInPaisa,
        mileage: parseInt(formData.mileage),
        description: formData.description.trim() || null,
      });

      queryClient.invalidateQueries({ queryKey: ['my-cars'] });
      queryClient.invalidateQueries({ queryKey: ['cars'] });

      toast.success('Car updated successfully!');
      navigate('/my-cars');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update car';
      toast.error(Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  };

  if (carLoading) return <div>Loading...</div>;
  if (!car) return <div>Car not found</div>;
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
            Edit Your Car
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Title (e.g. 2018 Honda Civic EX)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                required
                min="1980"
                max="2026"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Price in PKR"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                min="100000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Mileage (km)"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                required
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition"
            >
              {loading ? 'Updating...' : 'Update Car'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}