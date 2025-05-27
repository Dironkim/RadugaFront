import {
    createContext,
    useState,
    useEffect,
    type ReactNode,
    useContext,
  } from "react";
  
  // ===== Типы =====
  
  export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    imagePaths: string[];
    requiresSize?: boolean;
    width?: number;
    height?: number;
    tailoringFee?: number;
  }
  
  
  interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    updateDimensions: (productId: number, width: number, height: number) => void;
    clearCart: () => void;
  }
  
  // ===== Контекст =====
  
  const CartContext = createContext<CartContextType | undefined>(undefined);
  
  // ===== Провайдер =====
  
  export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
    useEffect(() => {
      const stored = localStorage.getItem("cart");
      if (stored) {
        try {
          const parsed: CartItem[] = JSON.parse(stored);
          setCartItems(parsed);
        } catch {
          console.warn("Ошибка при разборе localStorage.cart");
        }
      }
    }, []);
  
    useEffect(() => {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);
  
    const addToCart = (product: Omit<CartItem, "quantity">) => {
      setCartItems(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
          return prev.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prev, { ...product, quantity: 1 }];
        }
      });
    };
  
    const removeFromCart = (productId: number) => {
      setCartItems(prev => prev.filter(item => item.id !== productId));
    };
  
    const updateQuantity = (productId: number, quantity: number) => {
      setCartItems(prev =>
        prev.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    };
  
    const updateDimensions = (productId: number, width: number, height: number) => {
      setCartItems(prev =>
        prev.map(item =>
          item.id === productId ? { ...item, width, height } : item
        )
      );
    };
  
    const clearCart = () => {
      setCartItems([]);
    };
  
    return (
      <CartContext.Provider
        value={{
          cartItems,
          addToCart,
          removeFromCart,
          updateQuantity,
          updateDimensions,
          clearCart,
        }}
      >
        {children}
      </CartContext.Provider>
    );
  };
  
  
  // ===== Хук =====
  
  export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
      throw new Error("useCart must be used within a CartProvider");
    }
    return context;
  };
  