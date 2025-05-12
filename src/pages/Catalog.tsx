import { useEffect, useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProductCard } from "@/my-components/ProductCard";

import { fetchCategories } from "@/api/categoryApi";
import { fetchProductsByCategory } from "@/api/productApi";
import { type Category, type Product } from "@/types/models";

export default function CatalogPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Record<number, Product[]>>({});
  const [loadingProducts, setLoadingProducts] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        setCategories(res);
        if (res.length > 0) {
          setSelected(res[0].id.toString());
          loadProducts(res[0].id);
        }
      } catch (e) {
        setError("Ошибка при загрузке категорий");
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const loadProducts = async (categoryId: number) => {
    setLoadingProducts(categoryId);
    try {
      const res = await fetchProductsByCategory(categoryId);
      setProducts((prev) => ({ ...prev, [categoryId]: res }));
    } catch (e) {
      console.error("Ошибка при загрузке товаров:", e);
    } finally {
      setLoadingProducts(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4 grid gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded" />
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
    <Tabs value={selected ?? undefined} onValueChange={(val) => {
      setSelected(val);
      const categoryId = parseInt(val);
      if (!products[categoryId]) loadProducts(categoryId);
    }} className="w-full min-h-screen p-4">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {categories.map((category) => (
          <TabsTrigger key={category.id} value={category.id.toString()}>
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((category) => (
        <TabsContent key={category.id} value={category.id.toString()} className="mt-6">
        {loadingProducts === category.id ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(products[category.id] ?? []).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </TabsContent>
      ))}
    </Tabs>
  );
}
