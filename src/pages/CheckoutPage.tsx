import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { createOrder } from "@/api/orderApi";
import { fetchSalons } from "@/api/salonApi";
import {type Salon} from "@/types/models";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const [selectedSalonId, setSelectedSalonId] = useState<number | null>(null);
  const [salons, setSalons] = useState<Salon[]>([]);
  const navigate = useNavigate();

  const getItemSubtotal = (item: typeof cartItems[number]) => {
    if (item.requiresSize && item.width && item.height) {
      const area = item.width * item.height;
      const tailoring = item.tailoringFee ?? 0;
      return (area * item.price + tailoring) * item.quantity;
    }
    return item.price * item.quantity;
  };
  
  const totalPrice = cartItems.reduce((total, item) => total + getItemSubtotal(item), 0);
  

  useEffect(() => {
    fetchSalons().then(setSalons).catch(console.error);
  }, []);

  const handleConfirm = async () => {
    if (selectedSalonId === null) return;

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const orderDto = {
      statusId: 2,
      userId,
      salonId: selectedSalonId,
      orderProducts: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        width: item.requiresSize ? item.width : undefined,
        height: item.requiresSize ? item.height : undefined,
      })),
      
    };

    try {
      await createOrder(orderDto);
      clearCart();
      navigate("/thank-you");
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Оформление заказа</h1>

      <Card>
        <CardHeader>
          <CardTitle>Товары в заказе</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Кол-во</TableHead>
                <TableHead>Сумма</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.id}>
                <TableCell>
                  {item.name}
                  {item.requiresSize && item.width && item.height && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {item.width} м × {item.height} м
                    </div>
                  )}
                </TableCell>
                <TableCell>
  {item.price.toFixed(2)} ₽
  {item.requiresSize && (
    <span className="block text-sm text-muted-foreground">за 1м²</span>
  )}
  {item.tailoringFee && (
    <span className="block text-sm text-muted-foreground">
      + {item.tailoringFee} ₽ пошив
    </span>
  )}
</TableCell>

                <TableCell>{item.quantity}</TableCell>
                <TableCell>{getItemSubtotal(item).toFixed(2)} ₽</TableCell>

              </TableRow>
              
              ))}
              <TableRow>
                <TableCell colSpan={3} className="font-bold text-right">Итого:</TableCell>
                <TableCell className="font-bold">{totalPrice.toFixed(2)} ₽</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Выберите салон для получения заказа</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {salons.map((salon) => (
            <div key={salon.id} className="border rounded p-4 space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="salon"
                  value={salon.id}
                  checked={selectedSalonId === salon.id}
                  onChange={() => setSelectedSalonId(salon.id)}
                />
                <span>{salon.name} — {salon.address}</span>
              </label>
              <Button
                variant="outline"
                onClick={() =>
                  window.open(`https://yandex.ru/maps/?text=${encodeURIComponent(salon.address)}`, "_blank")
                }
              >
                Показать на карте
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Link to="/cart">
          <Button variant="secondary">Назад в корзину</Button>
        </Link>
        <Button disabled={selectedSalonId === null} onClick={handleConfirm}>
          Подтвердить оформление заказа
        </Button>
      </div>
    </div>
  );
}
