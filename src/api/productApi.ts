import api from "@/api/base";
import { getAuthHeader } from "./auth";
import { type Product } from "@/types/models";

export const fetchProducts = async (): Promise<Product[]> => {
  const res = await api.get("/products");
  return res.data;
};

export const fetchProduct = async (id: number): Promise<Product> => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const createProduct = async (data: Partial<Product>) => {
  return await api.post("/products", data, getAuthHeader());
};

export const updateProduct = async (id: number, data: Partial<Product>) => {
  return await api.put(`/products/${id}`, data, getAuthHeader());
};

export const deleteProduct = async (id: number) => {
  return await api.delete(`/products/${id}`, getAuthHeader());
};

export const fetchProductsByCategory = async (categoryId: number) => {
  const res = await api.get(`/products/category/${categoryId}`);
  return res.data;
};
