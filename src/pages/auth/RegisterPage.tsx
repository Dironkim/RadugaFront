import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useState } from "react"
import { Link } from "react-router-dom"
import { register } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"


const passwordRequirements =
  "Минимум 6 символов, 1 заглавная латинская буква, 1 строчная латинская буква, 1 цифра, 1 спецсимвол";

const formSchema = z
  .object({
    fullName: z.string().min(1, "Укажите имя"),
    phone: z.string().min(10, "Укажите номер телефона"),
    email: z.string().email("Неверный email"),
    password: z
      .string()
      .min(6, "Минимум 6 символов")
      .regex(/[a-z]/, "Нужна строчная латинская буква")
      .regex(/[A-Z]/, "Нужна заглавная латинская буква")
      .regex(/[0-9]/, "Нужна цифра")
      .regex(/[^a-zA-Z0-9]/, "Нужен спецсимвол")
      ,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });





type FormData = z.infer<typeof formSchema>

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
    
  })

  async function onSubmit(values: FormData) {
    setLoading(true)
    try {
      await register({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phone: values.phone,
      })

      toast.success("Регистрация прошла успешно. Проверьте email для подтверждения.")
      navigate("/login", { replace: true })
    } catch (error: any) {
      console.error("Ошибка регистрации", error)
    
      const data = error?.response?.data
      if (data?.errors?.length) {
        data.errors.forEach((err: string) => toast.error(err))
      } else if (data?.message) {
        toast.error(data.message)
      } else {
        toast.error("Ошибка регистрации. Попробуйте позже.")
      }
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-muted">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">Регистрация</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя</FormLabel>
                    <FormControl>
                      <Input placeholder="Имя" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="example@mail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон</FormLabel>
                    <FormControl>
                      <Input placeholder="+79991234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Пароль
                      <span className="block text-xs text-muted-foreground">
                        {passwordRequirements}
                      </span>
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
                    <FormLabel>Подтверждение пароля</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                Зарегистрироваться
              </Button>

              <div className="text-sm text-muted-foreground mt-2 text-center">
                Уже есть аккаунт?{" "}
                <Link to="/login" className="hover:underline text-primary">
                  Войти
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
