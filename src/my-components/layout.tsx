// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import { Navbar } from "@/my-components/nav-bar";

export default function Layout() {
  return (
    <div>
      <Navbar />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
