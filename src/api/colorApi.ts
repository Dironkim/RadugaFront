// src/api/colorApi.ts
import api from "./base";
import { type Color } from "@/types/models";

export const fetchColors = async (): Promise<Color[]> => {
  const res = await api.get("/colors");
  return res.data;
};
