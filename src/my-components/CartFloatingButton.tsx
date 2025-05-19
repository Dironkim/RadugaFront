import { ShoppingCart } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function CartFloatingButton() {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate("/cart")}
      className="fixed bottom-4 right-4 z-50 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition"
    >
      <ShoppingCart className="w-6 h-6" />
    </button>
  )
}
