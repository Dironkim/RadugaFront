// src/api/categoryApi.ts
import api from "./base";
import { type Category } from "@/types/models";

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await api.get("/categories");
  return res.data;
};

export const fetchCategory = async (id: number): Promise<Category> => {
  const res = await api.get(`/categories/${id}`);
  return res.data;
};
