import { useCart, type CartItem } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { ImageCarousel } from "@/my-components/ImageCarousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, updateDimensions } = useCart();


  

  const handleQuantityChange = (value: string, productId: number) => {
    const quantity = parseInt(value, 10);
    if (quantity > 0) {
      updateQuantity(productId, quantity);
    }
  };
  const getItemSubtotal = (item: CartItem) => {
    if (item.requiresSize && item.width && item.height) {
      const area = item.width * item.height;
      const base = area * item.price;
      const tailoring = item.tailoringFee ?? 0;
      return (base + tailoring) * item.quantity;
    }
    return item.price * item.quantity;
  };
  
  const totalPrice = cartItems.reduce((total, item) => total + getItemSubtotal(item), 0);
  
  const handleDimensionChange = (
    productId: number,
    field: "width" | "height",
    value: string
  ) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      const item = cartItems.find(i => i.id === productId);
      if (item) {
        const width = field === "width" ? num : item.width ?? 1;
        const height = field === "height" ? num : item.height ?? 1;
        updateDimensions(productId, width, height);
      }
    }
  };
  

  if (cartItems.length === 0) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Корзина</h1>
        <p className="text-muted-foreground">
          Ваша корзина пуста.{" "}
          <Link to="/" className="underline">
            Перейти к покупкам
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Корзина</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Товар</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead>Количество</TableHead>
            <TableHead>Итого</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cartItems.map((item) => (
            <TableRow key={item.id}>
            <TableCell>
              <div className="flex items-center gap-4">
                <div className="w-24">
                  <ImageCarousel images={item.imagePaths} />
                </div>
                <span className="font-medium">{item.name}</span>
              </div>
            </TableCell>
          
            <TableCell>{item.price.toFixed(2)} ₽</TableCell>
          
            <TableCell className="align-top">
  <div className="flex flex-col gap-2">
    <Input
      type="number"
      min={1}
      value={item.quantity}
      onChange={(e) => handleQuantityChange(e.target.value, item.id)}
      className="w-24"
    />

    {item.requiresSize && (
      <div className="flex flex-col gap-2">
        <div>
          <label className="text-sm text-muted-foreground">Ширина (м):</label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={item.width ?? ""}
            onChange={(e) =>
              handleDimensionChange(item.id, "width", e.target.value)
            }
            className="w-24"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Высота (м):</label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={item.height ?? ""}
            onChange={(e) =>
              handleDimensionChange(item.id, "height", e.target.value)
            }
            className="w-24"
          />
        </div>
      </div>
    )}
  </div>
</TableCell>

          
            <TableCell>
              {item.price.toFixed(2)} ₽
              {item.requiresSize && (
                <span className="block text-sm text-muted-foreground">
                  за 1м²
                </span>
              )}
              {item.tailoringFee && (
                <span className="block text-sm text-muted-foreground">
                  + {item.tailoringFee} ₽ пошив
                </span>
              )}
            </TableCell>

          
            <TableCell>
              <Button variant="destructive" onClick={() => removeFromCart(item.id)}>
                Удалить
              </Button>
            </TableCell>
          </TableRow>
          
          ))}
        </TableBody>
      </Table>

      <div className="mt-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">
          Итого: {totalPrice.toFixed(2)} ₽
        </h2>
        <Link to="/checkout">
          <Button size="lg" className="text-lg">
            Оформить заказ
          </Button>
        </Link>
      </div>
    </div>
  );
}
