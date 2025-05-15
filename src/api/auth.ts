import api from "./base";
import { type AuthRequest } from "@/types/auth";
import { type AuthResponse } from "@/types/auth";

export const register = async (payload: AuthRequest): Promise<AuthResponse> => {
  const res = await api.post("/auth/register", payload);
  return res.data;
};

export const login = async (payload: AuthRequest): Promise<AuthResponse> => {
  const res = await api.post("/auth/login", payload);
  return res.data;
};
