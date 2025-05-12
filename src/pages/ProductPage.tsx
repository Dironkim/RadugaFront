import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProduct } from "@/api/productApi";
import { type Product } from "@/types/models";
import { CustomCarousel } from "@/my-components/custom-carousel";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;

      const id = parseInt(productId);
      if (isNaN(id)) {
        setError("Некорректный ID товара");
        setLoading(false);
        return;
      }

      try {
        const response = await fetchProduct(id);
        setProduct(response);
      } catch {
        setError("Ошибка при загрузке товара");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
  };

  const transformImages = (imagePaths: string[]) => {
    return (imagePaths || []).map((path, index) => ({
      src: path,
      alt: `Изображение ${index + 1}`,
      captionTitle: `Фото ${index + 1}`,
      captionText: `Описание ${index + 1}`,
    }));
  };

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Skeleton className="h-[400px] mb-6" />
        <Skeleton className="h-6 w-2/3 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <Skeleton className="h-10 w-40" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertTitle>Ошибка</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!product) {
    return <p className="text-center text-muted-foreground">Товар не найден</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <div className="mb-6">
        <CustomCarousel images={transformImages(product.imagePaths)} />
      </div>
      <div className="space-y-4">
        <p className="text-muted-foreground">{product.longDescription}</p>
        <p className="text-lg font-semibold">Цена: ${product.price}</p>
        <Button onClick={handleAddToCart}>Добавить в корзину</Button>
      </div>
    </div>
  );
}
