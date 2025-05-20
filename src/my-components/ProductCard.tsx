import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom"
import { ShoppingCart } from "lucide-react"
import { ImageCarousel } from "@/my-components/ImageCarousel";
import { type Product } from "@/types/models";
import { useCart } from '@/context/CartContext';

type Props = {
  product: Product
}

export function ProductCard({ product }: Props) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imagePaths: product.imagePaths,
    })
  }
  const navigate = useNavigate()
  const handleCardClick = () => navigate(`/product/${product.id}`)
  return (
      <Card onClick={handleCardClick} className="overflow-hidden cursor-pointer transition-all hover:shadow-md">
        <div className="relative w-full h-[200px] overflow-hidden rounded-t-xl">
          <div onClick={(e) => e.stopPropagation()} className="absolute inset-0">
            <ImageCarousel images={product.imagePaths} />
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-muted-foreground text-sm mt-1">{product.shortDescription}</p>
              <p className="mt-2 font-bold">{product.price} ₽</p>
            </div>
            <Button size="sm" className="mt-1" onClick={(e) => {e.stopPropagation(); handleAddToCart()}} aria-label={`Add ${product.name} to cart`}>
              <ShoppingCart className="h-4 w-4 mr-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
  )
}