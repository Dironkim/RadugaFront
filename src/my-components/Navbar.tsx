// components/Navbar.tsx
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";


export function Navbar() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const hideAuthButton = ["/login", "/register", "/forgot-password"].includes(location.pathname);

  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-border px-2 py-4 flex items-center justify-between !w-full">
      <Link to="/" className="text-xl font-bold text-primary">
        Raduga Store
      </Link>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/" className="text-sm px-2 py-2 hover:underline">
                Главная
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/curtains" className="text-sm px-2 py-2 hover:underline">
                Каталог
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/contacts" className="text-sm px-4 py-2 hover:underline">
                Контакты
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
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
