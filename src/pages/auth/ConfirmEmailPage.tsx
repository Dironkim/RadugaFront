import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import api from "@/api/base";

export default function EmailConfirmationPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");

  useEffect(() => {
    const token = searchParams.get("token");
    const userId = searchParams.get("userId");
    if (token) {
      api
      .post("/auth/confirm-email", {
        userId: userId,
        token: token,
      })
        .then(() => setStatus("success"))
        .catch(() => setStatus("error"));
    } else {
      setStatus("error");
    }
  }, [searchParams]);

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Подтверждение email</CardTitle>
        </CardHeader>
        <CardContent>
          {status === "pending" && (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="animate-spin" />
              <span>Подтверждение...</span>
            </div>
          )}
          {status === "success" && <p>Email успешно подтвержден.</p>}
          {status === "error" && <p>Ошибка подтверждения. Ссылка недействительна или устарела.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
