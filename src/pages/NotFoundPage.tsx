// pages/NotFoundPage.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-md w-full shadow-lg text-center">
        <CardHeader>
          <CardTitle>Страница не найдена</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Ой, такой страницы еще не существует.
          </p>
          <Button asChild>
            <Link to="/">На главную</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
