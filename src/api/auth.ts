import api from "./base";
import { type AuthRequest, type AuthResponse, type RegisterRequest, type ChangePasswordRequest, type ForgotPasswordForm, type ResetPasswordRequest } from "@/types/auth";


export const register = async (payload: RegisterRequest): Promise<AuthResponse> => {
  const res = await api.post("/auth/register", payload);
  return res.data;
};

export const login = async (payload: AuthRequest): Promise<AuthResponse> => {
  const res = await api.post("/auth/login", payload);
  return res.data;
};

export const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const changePassword = async (payload: ChangePasswordRequest): Promise<void> => {
  await api.post("/auth/change-password", payload, getAuthHeader())
}
export const forgotPassword = async (payload: ForgotPasswordForm): Promise<void> => {
  await api.post("/auth/forgot-password", payload)
}
export const resetPassword = async (payload: ResetPasswordRequest): Promise<void> => {
  await api.post("/auth/reset-password", payload)
}