import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import type { Car } from "../types/car";

export const useCars = () => {
  return useQuery<Car[]>({
    queryKey: ["cars"],
    queryFn: async () => {
      const { data } = await api.get("/cars");
      return data;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export const useMyCars = () => {
  return useQuery<Car[]>({
    queryKey: ["my-cars"],
    queryFn: async () => {
      const { data } = await api.get("/cars/my-cars");
      return data;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
