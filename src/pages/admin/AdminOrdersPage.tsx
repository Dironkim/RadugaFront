import { useEffect, useState } from "react";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchOrders, updateOrderStatus, fetchOrderStatuses } from "@/api/orderApi";
import { fetchUser } from "@/api/userApi";
import { type Order, type OrderStatus, type User } from "@/types/models";
import { OrderDetailsDialog } from "@/my-components/AdminPanel/OrderPanel/OrderDetailsDialog";
import { UserDetailsDialog } from "@/my-components/AdminPanel/OrderPanel/UserDetailsDialog";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<OrderStatus[]>([]);
  const [editedStatuses, setEditedStatuses] = useState<Record<number, number>>({});
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchOrders().then(setOrders);
    fetchOrderStatuses().then(setStatuses);
  }, []);

  const handleUserClick = async (userId: string) => {
    const user = await fetchUser(userId);
    setSelectedUser(user);
  };

  const handleSaveStatus = async (orderId: number) => {
    const newStatusId = editedStatuses[orderId];
    if (!newStatusId) return;
    await updateOrderStatus(orderId, newStatusId);
    const updated = await fetchOrders();
    setOrders(updated);
    setEditedStatuses(prev => {
      const copy = { ...prev };
      delete copy[orderId];
      return copy;
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Управление заказами</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Пользователь</TableHead>
            <TableHead>ID заказа</TableHead>
            <TableHead>Салон</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Button variant="link" onClick={() => handleUserClick(order.userId)}>
                  userId: {order.userId}
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="link" onClick={() => setSelectedOrder(order)}>
                  #{order.id}
                </Button>
              </TableCell>
              <TableCell>{order.salonName}</TableCell>
              <TableCell>
                <Select
                  value={(editedStatuses[order.id] ?? order.statusId).toString()}
                  onValueChange={(value) =>
                    setEditedStatuses(prev => ({ ...prev, [order.id]: +value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status.id} value={status.id.toString()}>
                        {status.readableName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSaveStatus(order.id)} disabled={!editedStatuses[order.id]}>
                  Сохранить
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <OrderDetailsDialog order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      <UserDetailsDialog user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}
