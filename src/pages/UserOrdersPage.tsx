import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchUserOrders } from "@/api/orderApi";
import { fetchOrderStatuses } from "@/api/orderApi"; // или откуда у тебя
import { type Order } from "@/types/models";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function UserOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<Record<number, string>>({});
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    Promise.all([
      fetchUserOrders(user.id),
      fetchOrderStatuses()
    ])
      .then(([ordersData, statusesData]) => {
        setOrders(ordersData);
        const statusMap = Object.fromEntries(
          statusesData.map((s) => [s.id, s.readableName])
        );
        setStatuses(statusMap);
      })
      .catch(console.error);
  }, [user?.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Мои заказы</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p>У вас пока нет заказов.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Номер</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Салон</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Детали</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{order.salonName}</TableCell>
                  <TableCell>{statuses[order.statusId] || "—"}</TableCell>
                  <TableCell>
                    {order.orderProducts.reduce((sum, p) => sum + p.subtotal, 0)} ₽
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" onClick={() => setSelectedOrder(order)}>
                      Открыть
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {selectedOrder && (
        <Dialog open={true} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Детали заказа #{selectedOrder.id}</DialogTitle>
            </DialogHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Товар</TableHead>
                  <TableHead>Кол-во</TableHead>
                  <TableHead>Размер</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead>Сумма</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedOrder.orderProducts.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell>{p.productName}</TableCell>
                    <TableCell>{p.quantity}</TableCell>
                    <TableCell>
                      {p.width && p.height ? `${p.width}×${p.height} см` : "—"}
                    </TableCell>
                    <TableCell>{p.currentPrice} ₽</TableCell>
                    <TableCell>{p.subtotal} ₽</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
