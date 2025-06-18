import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImageCarousel } from "@/my-components/ImageCarousel";
import { fetchOrder } from "@/api/orderApi";
import { fetchSalons } from "@/api/salonApi";
import { fetchImages } from "@/api/imageApi";
import { type Order, type Salon, type Image } from "@/types/models";
import { type CartItem } from "@/context/CartContext";
import { toast } from "sonner";
import { suggestOrderChanges } from "@/api/orderApi";
import { useNavigate } from "react-router-dom";





export default function EditOrderPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [selectedSalonId, setSelectedSalonId] = useState<number | null>(null);
  const navigate = useNavigate();
  
  const handleSubmit = async () => {
    if (!order || !selectedSalonId) return;
  
    const updatedProducts = items.map((item) => ({
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      currentPrice: item.price,
      subtotal: getItemSubtotal(item),
      width: item.width,
      height: item.height,
    }));
  
    const dto = {
      orderId: order.id,
      updatedProducts,
      salonId: selectedSalonId,
      salonName: salons.find((s) => s.id === selectedSalonId)?.name ?? "",
      createdAt: new Date().toISOString(),
    };
  
    try {
      await suggestOrderChanges(order.id, dto);
      toast.success("Изменения предложены");
      navigate("/admin/orders");
    } catch {
      toast.error("Ошибка при отправке изменений");
    }
  };



  useEffect(() => {
    if (!orderId) return;

    fetchOrder(+orderId)
      .then(async (o) => {
        setOrder(o);
        setSelectedSalonId(o.salonId);

        const enriched = await Promise.all(
          o.orderProducts.map(async (p) => {
            const images: Image[] = await fetchImages(p.productId);
            return {
              id: p.productId,
              name: p.productName,
              price: p.currentPrice,
              quantity: p.quantity,
              width: p.width,
              height: p.height,
              requiresSize: !!(p.width || p.height),
              imagePaths: images.map((i) => i.imageUrl),
              tailoringFee: 0,
            } satisfies CartItem;
          })
        );

        setItems(enriched);
      })
      .catch(() => toast.error("Ошибка загрузки заказа"));

    fetchSalons()
      .then(setSalons)
      .catch(() => toast.error("Ошибка загрузки салонов"));
  }, [orderId]);

  const updateItem = (id: number, changes: Partial<CartItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...changes } : item))
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const getItemSubtotal = (item: CartItem) => {
    if (item.requiresSize && item.width && item.height) {
      const area = item.width * item.height;
      return (area * item.price + (item.tailoringFee ?? 0)) * item.quantity;
    }
    return item.price * item.quantity;
  };

  const totalPrice = items.reduce((sum, i) => sum + getItemSubtotal(i), 0);

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold">Редактирование заказа #{order?.id}</h1>

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
                <span>
                  {salon.name} — {salon.address}
                </span>
              </label>
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    `https://yandex.ru/maps/?text=${encodeURIComponent(
                      salon.address
                    )}`,
                    "_blank"
                  )
                }
              >
                Показать на карте
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Состав заказа</CardTitle>
          <Button variant="outline">Добавить товар из каталога</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Товар</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Количество</TableHead>
                <TableHead>Итого</TableHead>
                <TableHead>Удалить</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
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
                        updateItem(item.id, {
                          quantity: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-20 mb-2"
                    />

                    {item.requiresSize && (
                      <div className="flex flex-col gap-1 mt-1">
                        <label className="text-sm text-muted-foreground">
                          Ширина (м):
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.width ?? ""}
                          onChange={(e) =>
                            updateItem(item.id, {
                              width: parseFloat(e.target.value),
                            })
                          }
                          className="w-24"
                        />
                        <label className="text-sm text-muted-foreground">
                          Высота (м):
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.height ?? ""}
                          onChange={(e) =>
                            updateItem(item.id, {
                              height: parseFloat(e.target.value),
                            })
                          }
                          className="w-24"
                        />
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    {getItemSubtotal(item).toFixed(2)} ₽
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
                    <Button
                      variant="destructive"
                      onClick={() => removeItem(item.id)}
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
    <Button size="lg" className="text-lg" onClick={handleSubmit}>
      Предложить изменения
    </Button>
  </div>
        </CardContent>
      </Card>
    </div>
  );
}
