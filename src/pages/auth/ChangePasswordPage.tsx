import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { changePassword } from "@/api/auth"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const passwordRequirements =
  "Минимум 6 символов, 1 заглавная латинская буква, 1 строчная, 1 цифра, 1 спецсимвол"

const schema = z
  .object({
    currentPassword: z.string().min(6, "Текущий пароль обязателен"),
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

export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      await changePassword(data)
      toast.success("Пароль успешно изменён")
      form.reset()
      navigate("/profile")
    } catch (error: any) {
      const errors = error?.response?.data?.errors
      if (Array.isArray(errors)) {
        errors.forEach((msg: string) => toast.error(msg))
      } else {
        toast.error(error?.response?.data?.message || "Ошибка при изменении пароля")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Сменить пароль</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Текущий пароль</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Сохраняем..." : "Сменить пароль"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
