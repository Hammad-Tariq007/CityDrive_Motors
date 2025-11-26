import { useCars } from '../hooks/useCars';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CarCard from '../components/CarCard';
import Footer from '../components/Footer';

export default function Home() {
  const { data: cars, isLoading } = useCars();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />

      <div id="cars-section" className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            Featured Cars
          </h2>
          <p className="text-xl text-gray-600">
            Handpicked selection of premium vehicles
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-600">Loading cars...</p>
          </div>
        ) : cars && cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-3xl text-gray-600">No cars listed yet.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}