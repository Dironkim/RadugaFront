import { useCart } from "@/context/CartContext";
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
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleQuantityChange = (value: string, productId: number) => {
    const quantity = parseInt(value, 10);
    if (quantity > 0) {
      updateQuantity(productId, quantity);
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
              <TableCell>
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(e.target.value, item.id)
                  }
                  className="w-20"
                />
              </TableCell>
              <TableCell>
                {(item.price * item.quantity).toFixed(2)} ₽
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => removeFromCart(item.id)}
                >
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
