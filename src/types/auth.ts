export interface AuthRequest {
email: string;
password: string;
}

export interface AuthResponse {
token: string;
role: string;
}

export type JwtPayload = {
    role: string
    // можно добавить и другие поля (sub, exp и т.д.)
  }