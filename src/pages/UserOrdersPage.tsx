import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchUserOrders } from "@/api/orderApi";
import { fetchOrderStatuses } from "@/api/orderApi";
import { type Order } from "@/types/models";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderDetailsDialog } from "@/my-components/AdminPanel/OrderPanel/OrderDetailsDialog";

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
                <TableHead>Обновления</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
              const hasPendingChanges = !!order.pendingChange;

                return (
                  <TableRow key={order.id}>
                    <TableCell className="flex items-center gap-2">
                      {order.id}              

                    </TableCell>
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
                    <TableCell>
                      {hasPendingChanges && (
                        <Badge
                        variant="outline"
                        title="Есть обновления, откройте детали, чтобы посмотреть"
                        className="text-[var(--background)] bg-[var(--primary)] hover:bg-[var(--secondary)] transition-colors"
                      >
                        1
                      </Badge>
                      
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {selectedOrder && (
        <OrderDetailsDialog
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

    </Card>
  );
}
