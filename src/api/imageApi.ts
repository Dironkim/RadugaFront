import api from "./base";
import { type Image } from "@/types/models";
import { getAuthHeader } from "./auth";

export const fetchImages = async (productId: number): Promise<Image[]> => {
  const res = await api.get(`/images/${productId}`);
  return res.data;
};

export const createImage = async (formData: FormData) => {
  return await api.post("/images/upload", formData, getAuthHeader());
};

export const updateImage = async (productId: number, formData: FormData) => {
  return await api.put(`/images/${productId}`, formData, getAuthHeader());
};

export const deleteImage = async (imageId: number) => {
  return await api.delete(`/images/${imageId}`, getAuthHeader());
};
