import { getAuthHeader } from "./auth";
import api from "./base";
import { type User } from "@/types/models";

export const fetchUser = async (userId: string): Promise<User> => {
  const res = await api.get(`/users/${userId}`,getAuthHeader());
  return res.data;
};
