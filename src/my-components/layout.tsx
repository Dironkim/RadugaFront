// src/components/Layout.tsx
import { Outlet, useLocation } from "react-router-dom"
import { Navbar } from "@/my-components/Navbar";
import CartFloatingButton from '@/my-components/CartFloatingButton'
export default function Layout() {
  const { pathname } = useLocation()
  const hideCart = ["/login", "/register"].includes(pathname)
  return (
    <div className="mx-0">
      <Navbar />
      <main className="p-2 !w-full">
        <Outlet />
        {!hideCart && <CartFloatingButton />}
      </main>
    </div>
  );
}
