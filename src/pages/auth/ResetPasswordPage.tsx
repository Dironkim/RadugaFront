import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { resetPassword } from "@/api/auth"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const passwordRequirements =
  "Минимум 6 символов, 1 заглавная латинская буква, 1 строчная, 1 цифра, 1 спецсимвол"

const schema = z
  .object({
    newPassword: z
      .string()
      .min(6)
      .regex(/[a-z]/, "Нужна строчная латинская буква")
      .regex(/[A-Z]/, "Нужна заглавная латинская буква")
      .regex(/[0-9]/, "Нужна цифра")
      .regex(/[^a-zA-Z0-9]/, "Нужен спецсимвол"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Пароли не совпадают",
  })

type FormData = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const email = params.get("email") || ""
  const token = params.get("token") || ""

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setError(null)
    try {
      await resetPassword({ email, token, newPassword: data.newPassword })
      setSuccess(true)
      setTimeout(() => navigate("/login", { replace: true }), 3000)
    } catch (err: any) {
      const message = err?.response?.data?.message || "Ошибка сброса пароля"
      setError(message)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Сброс пароля</h1>

      {success ? (
        <p className="text-green-600">Пароль успешно изменён. Переход к входу...</p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Новый пароль
                    <span className="block text-xs text-muted-foreground">{passwordRequirements}</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Подтвердите пароль</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button type="submit" className="w-full">Сбросить пароль</Button>
          </form>
        </Form>
      )}
    </div>
  )
}
