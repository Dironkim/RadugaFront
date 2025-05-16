// src/pages/ProfilePage.tsx

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

  const handleDeleteAccount = async () => {
    if (confirm("Вы уверены, что хотите удалить аккаунт? Это действие необратимо.")) {
      // TODO: отправить запрос на удаление аккаунта
      await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      logout()
      navigate("/login")
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
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
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={handleChangePassword} variant="outline">
              Сменить пароль
            </Button>
            <Button onClick={() => { logout(); navigate("/login") }} variant="secondary">
              Выйти из аккаунта
            </Button>
            <Button onClick={handleDeleteAccount} variant="destructive">
              Удалить аккаунт
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
