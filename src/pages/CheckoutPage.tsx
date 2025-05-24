import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

const salons = [
  {
    id: 1,
    name: "Салон на Ленина, 25",
    address: "г. Киров, ул. Ленина, 25",
    mapUrl: "https://yandex.ru/maps/?text=Киров, Ленина 25",
  },
  {
    id: 2,
    name: "Салон на Октябрьском, 12",
    address: "г. Киров, Октябрьский пр-т, 12",
    mapUrl: "https://yandex.ru/maps/?text=Киров, Октябрьский 12",
  },
];

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const [selectedSalonId, setSelectedSalonId] = useState<number | null>(null);
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleConfirm = () => {
    if (selectedSalonId === null) return;
    // TODO: отправка на сервер (например, через fetch или axios)
    clearCart();
    navigate("/"); // или redirect на страницу "Спасибо за заказ"
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
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.price.toFixed(2)} ₽</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{(item.price * item.quantity).toFixed(2)} ₽</TableCell>
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
              <Button variant="outline" onClick={() => window.open(salon.mapUrl, "_blank")}>
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
