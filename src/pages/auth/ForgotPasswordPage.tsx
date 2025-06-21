import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useState } from "react"
import { Link } from "react-router-dom"
import { forgotPassword } from "@/api/auth"

const schema = z.object({
  email: z.string().email("Неверный email"),
})

type ForgotPasswordForm = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: ForgotPasswordForm) {
    setError(null)
    try {
      await forgotPassword(values)
      setSent(true)
    } catch (err: any) {
      const message = err?.response?.data?.message || "Ошибка отправки"
      setError(message)
    }
  }
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">Восстановление пароля</CardTitle>
        </CardHeader>
        <CardContent>
          {sent ? (
            <p className="text-sm text-center text-green-600">
              Инструкция отправлена на email
            </p>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full">
                  Отправить ссылку
                </Button>
                <div className="text-sm text-muted-foreground mt-2 text-center">
                  <Link to="/login" className="hover:underline text-primary">
                    Вернуться ко входу
                  </Link>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
