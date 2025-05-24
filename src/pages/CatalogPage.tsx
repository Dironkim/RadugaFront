import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Popover, PopoverContent, PopoverTrigger
} from "@/components/ui/popover"
import {
  RadioGroup, RadioGroupItem
} from "@/components/ui/radio-group"
import {
  Checkbox
} from "@/components/ui/checkbox"
import {ProductCard} from "@/my-components/ProductCard"
import { fetchProducts } from "@/api/productApi"
import { fetchCategories } from "@/api/categoryApi"
import { fetchTags } from "@/api/tagApi"
import { fetchColors } from "@/api/colorApi"
import type { Product, Category, Tag, Color } from "@/types/models"

export default function CatalogPage() {
  const [search, setSearch] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [colors, setColors] = useState<Color[]>([])

  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [tagFilter, setTagFilter] = useState<number[]>([])
  const [colorFilter, setColorFilter] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [prods, cats, tgs, cols] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchTags(),
        fetchColors(),
      ])
      setProducts(prods)
      setCategories(cats)
      setTags(tgs)
      setColors(cols)
      setLoading(false)
    }
    load()
  }, [])

  const toggle = (arr: number[], id: number): number[] =>
    arr.includes(id) ? arr.filter(i => i !== id) : [...arr, id]

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (categoryFilter === "all" || p.categoryId === +categoryFilter) &&
    (tagFilter.length === 0 || tagFilter.every(tagId => p.tagIds.includes(tagId))) &&
    (colorFilter.length === 0 || colorFilter.every(colorId => p.colorIds.includes(colorId)))
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <Input
          placeholder="Поиск товара..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Фильтры</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 space-y-4">
            <div>
              <p className="font-medium mb-2">Категории</p>
              <RadioGroup value={categoryFilter} onValueChange={setCategoryFilter}>
                <RadioGroupItem value="all" id="cat_all" /> <label htmlFor="cat_all">Все</label>
                {categories.map(c => (
                  <div key={c.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={String(c.id)} id={`cat_${c.id}`} />
                    <label htmlFor={`cat_${c.id}`}>{c.name}</label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <p className="font-medium mb-2">Теги</p>
              {tags.map(tag => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag_${tag.id}`}
                    checked={tagFilter.includes(tag.id)}
                    onCheckedChange={() => setTagFilter(prev => toggle(prev, tag.id))}
                  />
                  <label htmlFor={`tag_${tag.id}`}>{tag.name}</label>
                </div>
              ))}
            </div>
            <div>
              <p className="font-medium mb-2">Цвета</p>
              {colors.map(color => (
                <div key={color.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`color_${color.id}`}
                    checked={colorFilter.includes(color.id)}
                    onCheckedChange={() => setColorFilter(prev => toggle(prev, color.id))}
                  />
                  <label htmlFor={`color_${color.id}`}>{color.name}</label>
                </div>
              ))}
            </div>
            <Button variant="ghost" onClick={() => {
              setCategoryFilter("all")
              setTagFilter([])
              setColorFilter([])
            }}>Сбросить</Button>
          </PopoverContent>
        </Popover>
      </div>

      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
