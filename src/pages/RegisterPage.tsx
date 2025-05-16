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


const formSchema = z.object({
  fullName: z.string().min(1, "Укажите имя"),
  phone: z.string().min(10, "Укажите номер телефона"),
  email: z.string().email("Неверный email"),
  password: z.string().min(6, "Минимум 6 символов"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
})





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
    setLoading(true);
    try {
      const res = await register({ email: values.email, password: values.password, fullName: values.fullName, phone:values.phone });
      localStorage.setItem("token", res.token);
      navigate("/login")
      console.log("Регистрация успешна, роль:", res.user.role);
    } catch (err) {
      console.error("Ошибка регистрации", err);
    } finally {
      setLoading(false);
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
                    <FormLabel>Пароль</FormLabel>
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
