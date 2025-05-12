import { Card, CardContent } from "@/components/ui/card";
import { ImageCarousel } from "@/my-components/ImageCarousel";
import { type Product } from "@/types/models";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  return (
    <Card className="overflow-hidden">
      <div className="relative w-full h-[200px] overflow-hidden rounded-t-xl">
        <div className="absolute inset-0">
          <ImageCarousel images={product.imagePaths} />
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-muted-foreground text-sm mt-1">{product.shortDescription}</p>
        <p className="mt-2 font-bold">{product.price} ₽</p>
      </CardContent>
    </Card>
  );
}
