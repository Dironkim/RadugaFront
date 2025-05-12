import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCategory, fetchProductsByCategory } from "@/api";
import { type Product } from "@/types/models";
import { ImageCarousel } from "@/my-components/ImageCarousel";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!categoryId) return;

      const id = parseInt(categoryId);
      if (isNaN(id)) {
        setError("Некорректный ID категории");
        setLoading(false);
        return;
      }

      try {
        const [categoryRes, productsRes] = await Promise.all([
          fetchCategory(id),
          fetchProductsByCategory(id),
        ]);
        setCategoryName(categoryRes.name);
        setProducts(productsRes);
      } catch {
        setError("Ошибка при загрузке категории или продуктов");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[300px] rounded-xl" />
        ))}
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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        {categoryName.replace("-", " ").toUpperCase()}
      </h1>

      {products.length === 0 ? (
        <p className="text-muted-foreground">Нет товаров в этой категории.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
            >
              <div className="h-56">
                <ImageCarousel images={product.imagePaths} />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {product.shortDescription}
                </p>
                <p className="text-base font-medium">${product.price}</p>
                <Button
                  className="w-full"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  Перейти на страницу товара
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
