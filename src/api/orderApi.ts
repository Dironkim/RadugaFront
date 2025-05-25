import api from "@/api/base";
import { getAuthHeader } from "./auth";
import { type Order, type CreateOrderDto } from "@/types/models";

export const fetchOrders = async (): Promise<Order[]> => {
  const res = await api.get("/orders", getAuthHeader());
  return res.data;
};

export const fetchOrder = async (id: number): Promise<Order> => {
  const res = await api.get(`/orders/${id}`, getAuthHeader());
  return res.data;
};

export const createOrder = async (data: CreateOrderDto) => {
  return await api.post("/orders", data, getAuthHeader());
};

export const updateOrder = async (id: number, data: Partial<Order>) => {
  return await api.put(`/orders/${id}`, data, getAuthHeader());
};

export const deleteOrder = async (id: number) => {
  return await api.delete(`/orders/${id}`, getAuthHeader());
};
