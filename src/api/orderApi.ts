import api from "@/api/base";
import { getAuthHeader } from "./auth";
import { type Order, type OrderStatus, type CreateOrderDto } from "@/types/models";

export const fetchOrders = async (): Promise<Order[]> => {
  const res = await api.get("/orders", getAuthHeader());
  return res.data;
};

export const fetchUserOrders = async (userId: string): Promise<Order[]> => {
  const res = await api.get(`/orders/user/${userId}`, getAuthHeader());
  return res.data;
}

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

export const updateOrderStatus = async (orderId: number, statusId: number) => {
  return await api.put(`/orders/${orderId}/status/${statusId}`, null, getAuthHeader());
};

export const fetchOrderStatuses = async (): Promise<OrderStatus[]> => {
  const res = await api.get("/orders/statuses", getAuthHeader());
  return res.data;
};

export const suggestOrderChanges = async (id: number, dto: any): Promise<void> => {
  await api.put(`/orders/${id}/edit`, dto, getAuthHeader());
};

export const approveOrderChange = async (orderId: number, changeId: number): Promise<void> => {
  await api.post(`/orders/${orderId}/approve-change/${changeId}`, null, getAuthHeader());
};

export const rejectOrderChange = async (orderId: number, changeId: number): Promise<void> => {
  await api.post(`/orders/${orderId}/reject-change/${changeId}`, null, getAuthHeader());
};
