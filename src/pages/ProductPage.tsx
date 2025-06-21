import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProduct } from "@/api/productApi";
import { type Product, type Tag, type Color } from "@/types/models";
import { CustomCarousel } from "@/my-components/custom-carousel";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchTags } from "@/api/tagApi";
import { fetchColors } from "@/api/colorApi";

export default function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const { addToCart } = useCart();
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [allColors, setAllColors] = useState<Color[]>([]);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!productId) return;

      const id = parseInt(productId);
      if (isNaN(id)) {
        setError("Некорректный ID товара");
        setLoading(false);
        return;
      }

      try {
        const [productData, tags, colors] = await Promise.all([
          fetchProduct(id),
          fetchTags(),
          fetchColors(),
        ]);
        setProduct(productData);
        setAllTags(tags);
        setAllColors(colors);
      } catch {
        setError("Ошибка при загрузке данных");
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
      <div className="p-2 max-w-7xl mx-auto">
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
    <div className="p-4 mx-auto max-w-7xl space-y-8">
{/* Галерея */}
<div className="w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-md border">
  <CustomCarousel images={transformImages(product.imagePaths)} />
</div>


      {/* Информация */}
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="flex-1 space-y-4">
        <h1 className="!text-3xl font-semibold">{product.name}</h1>
          <p className="text-muted-foreground text-lg">{product.shortDescription}</p>

          {product.requiresSize ? (
            <div className="space-y-2">
              <div className="text-xl font-semibold text-primary">от {product.price} ₽ / м²</div>
              <div className="text-sm bg-yellow-100 text-yellow-800 inline-block px-3 py-1 rounded">
                Индивидуальный пошив
              </div>
              {product.tailoringFee && (
                <div className="text-sm text-muted-foreground">
                  + {product.tailoringFee} ₽ за пошив
                </div>
              )}
            </div>
          ) : (
            <div className="text-2xl font-bold text-primary">{product.price} ₽</div>
          )}

          <div className="pt-4">
            <Button onClick={handleAddToCart}>Добавить в корзину</Button>
          </div>
        </div>

        {/* Цвета */}
        {product.colorIds.length > 0 && (
  <div>
    <h2 className="font-semibold text-lg mb-2">Цвета:</h2>
    <div className="flex flex-wrap gap-2">
      {allColors
        .filter(color => product.colorIds.includes(color.id))
        .map(color => (
          <div
            key={color.id}
            className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm border"
          >
            {color.name}
          </div>
        ))}
    </div>
  </div>
)}


        {/* Описание */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Описание</h2>
          <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-line">
            {product.longDescription}
          </p>
        </div>

        {/* Теги */}
        {product.tagIds.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Теги</h2>
            <div className="flex flex-wrap gap-2">
              {allTags
                .filter(tag => product.tagIds.includes(tag.id))
                .map(tag => (
                  <span key={tag.id} className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    #{tag.name}
                  </span>
                ))}
            </div>
          </div>
        )}
</div>
</div>



        
      );
}
