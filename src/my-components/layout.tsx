// src/components/Layout.tsx
import { Outlet, useLocation } from "react-router-dom"
import { Navbar } from "@/my-components/Navbar";
import CartFloatingButton from '@/my-components/CartFloatingButton'
import { Toaster } from "@/components/ui/sonner"
import { ChatWidget } from "@/my-components/Chat/ChatWidget";


export default function Layout() {
  const { pathname } = useLocation()
  const hideCart = ["/login", "/register","/admin"].includes(pathname)
  const hideChat = ["/login", "/register","/admin"].includes(pathname)
  return (
    <div className="mx-0 min-h-[1000px] lg:min-w-[1000px]">
      <Navbar />
      <main className="p-2 !w-full min-h-[1000px]">
        <Outlet />
        <Toaster position="top-center" richColors />
        {!hideCart && <CartFloatingButton />}
        {!hideChat && <ChatWidget/>}
      </main>
    </div>
  );
}
