// components/auth/RequireRole.tsx
import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import type { JSX } from 'react';

export function RequireRole({
    children,
    allowedRoles,
  }: {
    children: JSX.Element
    allowedRoles: string[]
  }) {
    const { isAuthenticated, isLoading, user } = useAuth()
  
    if (isLoading) return null // или спиннер
  
    if (!isAuthenticated) return <Navigate to="/login" replace />
    if (!user.role || !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />
  
    return children
  }
  