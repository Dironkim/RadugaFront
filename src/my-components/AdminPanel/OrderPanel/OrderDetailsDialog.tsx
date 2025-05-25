import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { type Order } from "@/types/models";
  
  interface Props {
    order: Order | null;
    onClose: () => void;
  }
  
  export function OrderDetailsDialog({ order, onClose }: Props) {
    return (
      <Dialog open={!!order} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Информация о заказе #{order?.id}</DialogTitle>
          </DialogHeader>
          {order && (
            <div className="space-y-2">
              <p><strong>Дата:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Салон:</strong> {order.salonName}</p>
              <p><strong>Статус:</strong> {order.status}</p>
              <p><strong>Товары:</strong></p>
              <ul className="pl-4 list-disc">
                {order.orderProducts.map((item) => (
                  <li key={item.productId}>
                    {item.productName} — {item.quantity} шт. по {item.currentPrice} ₽
                  </li>
                ))}
              </ul>
              <p><strong>Сумма:</strong> {order.orderProducts.reduce((sum, p) => sum + p.subtotal, 0)} ₽</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }
  