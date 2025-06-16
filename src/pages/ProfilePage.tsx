import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleChangePassword = () => {
    navigate("/change-password")
  }

  const handleGoToOrders = () => {
    navigate("/orders")
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Личный кабинет</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Имя</label>
            <Input value={user.fullName || ""} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input value={user.email} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Телефон</label>
            <Input value={user.phone || ""} readOnly />
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-3">
      <Button className="w-full" onClick={handleGoToOrders}>
        Мои заказы
      </Button>
      <Button onClick={handleChangePassword} variant="outline" className="w-full">
        Сменить пароль
      </Button>
      <Button onClick={() => { logout(); navigate("/login") }} variant="secondary" className="w-full">
        Выйти из аккаунта
      </Button>
    </div>

    </div>
  )
}
