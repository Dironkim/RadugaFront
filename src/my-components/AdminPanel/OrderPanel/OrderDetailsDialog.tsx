import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type Order, type OrderStatus } from "@/types/models";
import { useEffect, useState } from "react";
import { fetchOrderStatuses, approveOrderChange, rejectOrderChange } from "@/api/orderApi";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Props {
  order: Order | null;
  onClose: () => void;
}

export function OrderDetailsDialog({ order, onClose }: Props) {
  const [statusMap, setStatusMap] = useState<Record<number, string>>({});
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderStatuses()
      .then((statuses: OrderStatus[]) => {
        const map = Object.fromEntries(statuses.map(s => [s.id, s.readableName]));
        setStatusMap(map);
      })
      .catch(console.error);
  }, []);

  const handleEdit = () => {
    if (!order) return;
    navigate(`/orders/${order.id}/edit`);
  };

  return (
    <Dialog open={!!order} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Информация о заказе #{order?.id}</DialogTitle>
        </DialogHeader>
        {order && (
          <div className="space-y-4">
            <div className="lg:flex lg:gap-8">
              {/* Текущий заказ */}
              <div className="lg:w-1/2 space-y-4">
                <h3 className="text-lg font-semibold">Текущий заказ</h3>
                <p><strong>Дата:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                <p><strong>Салон:</strong> {order.salonName}</p>
                <p><strong>Статус:</strong> {statusMap[order.statusId] || "—"}</p>
                <p><strong>Товары:</strong></p>
                <ul className="pl-4 list-disc">
                  {order.orderProducts.map((item) => (
                    <li key={item.productId}>
                      {item.productName} — {item.quantity} шт. по {item.currentPrice} ₽
                      {item.width && item.height && " за 1м²"}
                      {item.width && item.height && (
                        <span className="block text-muted-foreground text-sm">
                          Размер: {item.width} м × {item.height} м
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                <p><strong>Сумма:</strong> {order.orderProducts.reduce((sum, p) => sum + p.subtotal, 0)} ₽</p>
              </div>


              {/* Предложенные изменения */}
              {!!order.pendingChange && (
                <div className="lg:w-1/2 space-y-4 mt-8 lg:mt-0">
                  <h3 className="text-lg font-semibold text-yellow-800">Предложенные изменения</h3>
                  <p><strong>Новый салон:</strong> {order.pendingChange.salonName}</p>
                  <p><strong>Товары:</strong></p>
                  <ul className="pl-4 list-disc">
                    {order.pendingChange.updatedProducts.map((item) => (
                      <li key={item.productId}>
                        {item.productName} — {item.quantity} шт. по {item.currentPrice} ₽
                        {item.width && item.height && " за 1м²"}
                        {item.width && item.height && (
                          <span className="block text-muted-foreground text-sm">
                            Размер: {item.width} м × {item.height} м
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <p>
                    <strong>Новая сумма:</strong>{" "}
                    {order.pendingChange.updatedProducts.reduce((sum, p) => sum + p.subtotal, 0)} ₽
                  </p>
                  {user.role === "Registered" && order.pendingChange && (
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        onClick={() => {
                          if (!order.pendingChange) return;
                          approveOrderChange(order.id, order.pendingChange.id)
                            .then(() => onClose())
                            .catch(console.error);
                        }}
                      >
                        Принять
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (!order.pendingChange) return;
                          rejectOrderChange(order.id, order.pendingChange.id)
                            .then(() => onClose())
                            .catch(console.error);
                        }}
                      >
                        Отклонить
                      </Button>
                    </div>
                  )}

                </div>
              )}
            </div>

            {(user.role === "AdminDesigner" || user.role === "Registered") && (
              <Button onClick={handleEdit}>
                {user.role === "AdminDesigner" ? "Предложить изменения" : "Редактировать заказ"}
              </Button>
            )}
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
