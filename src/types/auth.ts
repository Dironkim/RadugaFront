export interface AuthRequest {
email: string;
password: string;
}

export interface RegisterRequest {
    email: string
    password: string
    fullName: string
    phone: string
  }

export interface AuthResponse {
    token: string
    user: {
      id: string
      email: string
      phone: string
      fullName: string
      role: string
    }
  }

  export interface AuthContextType {
    isAuthenticated: boolean
    user: {
      id: string | null
      email: string
      phone: string
      fullName: string
      role: string | null
    }
    setAuthData: (data: {
      token: string
      role: string
      userId: string
      email: string
      phone: string
      fullName: string
    }) => void
    logout: () => void
  }