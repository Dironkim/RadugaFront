import { useEffect, useState } from "react";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { fetchOrders } from "@/api/orderApi";
import { fetchUser } from "@/api/userApi"; // запрос по userId
import { type Order, type User } from "@/types/models";
import { OrderDetailsDialog } from "@/my-components/AdminPanel/OrderPanel/OrderDetailsDialog";
import { UserDetailsDialog } from "@/my-components/AdminPanel/OrderPanel/UserDetailsDialog";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchOrders().then(setOrders);
  }, []);

  const handleUserClick = async (userId: string) => {
    const user = await fetchUser(userId);
    setSelectedUser(user);
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
        <TableCell>{order.status}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>


      <OrderDetailsDialog order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      <UserDetailsDialog user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}
