import api from "@/api/base";
import { getAuthHeader } from "./auth";
import { type Salon } from "@/types/models";



export const fetchSalons = async (): Promise<Salon[]> => {
  const res = await api.get("/salons", getAuthHeader());
  return res.data;
};
