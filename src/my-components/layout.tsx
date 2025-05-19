// src/components/Layout.tsx
import { Outlet, useLocation } from "react-router-dom"
import { Navbar } from "@/my-components/Navbar";
import CartFloatingButton from '@/my-components/CartFloatingButton'
export default function Layout() {
  const { pathname } = useLocation()
  const hideCart = ["/login", "/register"].includes(pathname)
  return (
    <div>
      <Navbar />
      <main className="p-4">
        <Outlet />
        {!hideCart && <CartFloatingButton />}
      </main>
    </div>
  );
}
