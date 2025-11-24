export interface Car {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  description?: string;
  images: string[];
  isSold: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: { id: string; email: string };
  ownerId: string;
}