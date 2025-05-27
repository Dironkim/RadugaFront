import { useState, useEffect } from "react"
import {
  fetchProducts,
  deleteProduct,
} from "@/api/productApi"
import {
    fetchCategories,
  } from "@/api/categoryApi"
  import {
    fetchColors,
  } from "@/api/colorApi"
  import {
    fetchTags
  } from "@/api/tagApi"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ProductForm from "@/my-components/AdminPanel/ProductForm"
import {ImageCarousel} from "@/my-components/ImageCarousel"
import { type Product, type Category, type Tag, type Color } from "@/types/models"

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [colors, setColors] = useState<Color[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [formVisible, setFormVisible] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    loadProducts()
    loadCategories()
    loadColors()
    loadTags()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await fetchProducts()
      setProducts(data)
    } catch (err) {
      console.error("Ошибка загрузки товаров:", err)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await fetchCategories()
      setCategories(data)
    } catch (err) {
      console.error("Ошибка загрузки категорий:", err)
    }
  }

  const loadColors = async () => {
    try {
      const data = await fetchColors()
      setColors(data)
    } catch (err) {
      console.error("Ошибка загрузки цветов:", err)
    }
  }

  const loadTags = async () => {
    try {
      const data = await fetchTags()
      setTags(data)
    } catch (err) {
      console.error("Ошибка загрузки тегов:", err)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id)
      loadProducts()
    } catch (err) {
      console.error("Ошибка удаления товара:", err)
    }
  }

  const handleFormSave = () => {
    setFormVisible(false)
    setEditingProduct(null)
    loadProducts()
  }

  const handleFormCancel = () => {
    setFormVisible(false)
    setEditingProduct(null)
  }

  const openForm = (product: Product | null = null) => {
    setEditingProduct(product)
    setFormVisible(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Управление товарами</h1>
        <Button onClick={() => openForm()}>Новый товар</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список товаров</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Изображения</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <ImageCarousel images={product.imagePaths} />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openForm(product)}>
                      Изменить
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>
                      Удалить
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {formVisible && categories.length > 0 && (
  <ProductForm
    initialData={editingProduct ?? undefined}
    categories={categories}
    colors={colors}
    tags={tags}
    onSave={handleFormSave}
    onCancel={handleFormCancel}
  />
)}
    </div>
  )
}
