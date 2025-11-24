// src/hooks/useCars.ts
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import type { Car } from '../types/car';

// Public cars (Home page)
export const useCars = () => {
  return useQuery<Car[]>({
    queryKey: ['cars'],
    queryFn: async () => {
      const { data } = await api.get('/cars');
      return data;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

// Your cars (My Listings page)
export const useMyCars = () => {
  return useQuery<Car[]>({
    queryKey: ['my-cars'],
    queryFn: async () => {
      const { data } = await api.get('/cars/my-cars');  // Correct URL
      return data;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};