// components/Navbar.tsx
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu"

export function Navbar() {
  const { isAuthenticated, user } = useAuth(); // добавлено user
  const location = useLocation();

  const hideAuthButton = ["/login", "/register", "/forgot-password"].includes(location.pathname);
  const isAdminDesigner = isAuthenticated && user?.role === "AdminDesigner"; // проверка роли

  return (
    <header className="bg-[var(--secondary)] dark:bg-zinc-900 border-b border-border px-2 py-4 flex items-center justify-between !w-full">
      <Link to="/" className="text-xl font-bold text-primary">
        Raduga Store
      </Link>

      <NavigationMenu viewport={false} className="bg-[var(--secondary)] text-[var(--primary-foreground)]">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className="bg-[var(--secondary)] hover:bg-[var(--primary)]">
              <Link to="/catalog" className="text-sm px-2 py-2">
                Каталог
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className="bg-[var(--secondary)] hover:bg-[var(--primary)]">
              <Link to="/contacts" className="text-sm px-4 py-2">
                Контакты
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {isAdminDesigner && (
            <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-[var(--secondary)] hover:bg-[var(--primary)]">Панель управления</NavigationMenuTrigger>
            <NavigationMenuContent className="z-50 bg-white border shadow-md rounded-md absolute mt-2 w-[200px]">
              <ul className="flex flex-col p-2 min-w-[200px]">
                <li>
                  <Link to="/admin/orders" className="block px-4 py-2 hover:bg-muted">
                    Управление заказами
                  </Link>
                </li>
                <li>
                  <Link to="/admin/products" className="block px-4 py-2 hover:bg-muted">
                    Управление товарами
                  </Link>
                </li>
                <li>
                  <Link to="/admin/conversations" className="block px-4 py-2 hover:bg-muted">
                    Чаты
                  </Link>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          )}

        </NavigationMenuList>
      </NavigationMenu>

      {!hideAuthButton && (
        <div>
          {isAuthenticated ? (
            <Button asChild>
              <Link to="/profile">Профиль</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/login">Войти</Link>
            </Button>
          )}
        </div>
      )}
    </header>
  );
}

