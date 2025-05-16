import api from "./base";
import { type AuthRequest, type AuthResponse, type RegisterRequest } from "@/types/auth";


export const register = async (payload: RegisterRequest): Promise<AuthResponse> => {
  const res = await api.post("/auth/register", payload);
  return res.data;
};

export const login = async (payload: AuthRequest): Promise<AuthResponse> => {
  const res = await api.post("/auth/login", payload);
  return res.data;
};
