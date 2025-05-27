// pages/ThankYouPage.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ThankYouPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader>
          <CardTitle>Спасибо за заказ</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Наш консультант свяжется с вами по указанной при регистрации почте и/или номеру телефона.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
