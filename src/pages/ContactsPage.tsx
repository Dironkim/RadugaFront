import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Контакты</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-base">
          <div>
            <p className="font-semibold">Салон №1</p>
            <p>г. Киров, ул. Ленина, д. 25</p>
            <p>Тел: <a href="tel:+79001234567" className="text-primary hover:underline">+7 (900) 123-45-67</a></p>
            <p>Пн–Сб: 10:00–19:00, Вс: выходной</p>
            <a
              href="https://www.google.com/maps?q=Киров,+ул.+Ленина,+25"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Показать на карте
            </a>
          </div>
          <div className="pt-4 border-t">
            <p className="font-semibold">Салон №2</p>
            <p>г. Киров, пр-т. Октябрьский, д. 15</p>
            <p>Тел: <a href="tel:+79007654321" className="text-primary hover:underline">+7 (900) 765-43-21</a></p>
            <p>Пн–Сб: 10:00–19:00, Вс: выходной</p>
            <a
              href="https://www.google.com/maps?q=Киров,+пр-т.+Октябрьский,+15"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Показать на карте
            </a>
          </div>
          <p><strong>Email:</strong> <a href="mailto:info@raduga-store.ru" className="text-primary hover:underline">info@raduga-store.ru</a></p>
        </CardContent>
      </Card>

    </div>
  )
}
