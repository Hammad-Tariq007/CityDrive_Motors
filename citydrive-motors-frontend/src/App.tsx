import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import MyListings from './pages/MyListings';
import AddCar from './pages/AddCar';
import CarDetails from './pages/CarDetails';
import EditCar from './pages/EditCar';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/my-cars" element={<MyListings />} />
        <Route path="/add-car" element={<AddCar />} />
        <Route path="/car/:id" element={<CarDetails />} />
        <Route path="/edit-car/:id" element={<EditCar />} />
      </Routes>
    </BrowserRouter>
  );
}