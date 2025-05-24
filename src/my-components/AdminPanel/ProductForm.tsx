// ProductForm.tsx
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger,SelectValue, SelectContent, SelectItem } from '@radix-ui/react-select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@radix-ui/react-checkbox'
import {type Category, type Color,type Tag,type Image } from '@/types/models'
import {
  createProduct,
  updateProduct,
} from '@/api/productApi'
import {
    createImage,
    deleteImage,
    fetchImages
  } from '@/api/imageApi'

  const BASE_URL = import.meta.env.VITE_SERVER_URL as string;

  interface ProductFormData {
    id: number
    name: string
    categoryId: number
    price: number
    shortDescription: string
    longDescription: string
    tagIds: number[]
    colorIds: number[]
  }
  

  interface Props {
    categories: Category[]
    colors: Color[]
    tags: Tag[]
    onSave: () => void
    onCancel: () => void
    initialData?: Partial<ProductFormData> & { id?: number }
  }
  
  export default function ProductForm({ categories, colors, tags, onSave, onCancel, initialData }: Props) {
    const [productId, setProductId] = useState<number | null>(initialData?.id ?? null)
    const [form, setForm] = useState<ProductFormData>({
      id: initialData?.id ?? 0,
      name: initialData?.name ?? '',
      categoryId: initialData?.categoryId ?? categories[0]?.id ?? 0,
      price: initialData?.price ?? 0,
      shortDescription: initialData?.shortDescription ?? '',
      longDescription: initialData?.longDescription ?? '',
      tagIds: initialData?.tagIds ?? [],
      colorIds: initialData?.colorIds ?? [],
    })
    const [serverImages, setServerImages] = useState<Image[]>([])
    const [newImages, setNewImages] = useState<File[]>([])
    const [deletedImages, setDeletedImages] = useState<number[]>([])
  
    useEffect(() => {
        if (form.id > 0) {
          fetchImages(form.id).then(images =>
            setServerImages(images.map(img => ({ ...img, imageUrl: BASE_URL + img.imageUrl })))
          )
        }
      }, [form.id])
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setForm(prev => ({ ...prev, [name]: name === 'price' ? +value : value }))
    }
  
    const handleCheckboxChange = (id: number, key: 'tagIds' | 'colorIds') => {
      setForm(prev => {
        const arr = prev[key].includes(id)
          ? prev[key].filter(i => i !== id)
          : [...prev[key], id]
        return { ...prev, [key]: arr }
      })
    }
  
    const handleSubmit = async () => {
      let response
      if (productId) {
        response = await updateProduct(productId, form)
      } else {
        response = await createProduct(form)
        setProductId(response.data.id)
      }
      const id = productId ?? response.data.id
  
      for (const file of newImages) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('ImageUrl', file.name)
        fd.append('ProductId', id.toString())
        await createImage(fd)
      }
  
      for (const imgId of deletedImages) {
        await deleteImage(imgId)
      }
  
      onSave()
    }
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      setNewImages(prev => [...prev, ...files])
      const previews = files.map(f => ({ id: 0, imageUrl: URL.createObjectURL(f) }))
      setServerImages(prev => [...prev, ...previews])
    }
  
    const handleRemoveImage = (index: number, isNew: boolean) => {
      const img = serverImages[index]
      if (!isNew && img.id) setDeletedImages(prev => [...prev, img.id])
      if (isNew) setNewImages(prev => prev.filter((_, i) => i !== index))
      setServerImages(prev => prev.filter((_, i) => i !== index))
    }
  
    return (
      <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSubmit() }}>
        <div>
          <label className="block font-medium">Наименование</label>
          <Input name="name" value={form.name} onChange={handleChange} />
        </div>
  
        <div>
          <label className="block font-medium">Категория</label>
          <Select value={form.categoryId.toString()} onValueChange={val => setForm(prev => ({ ...prev, categoryId: +val }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
  
        <div>
          <label className="block font-medium">Краткое описание</label>
          <Input name="shortDescription" value={form.shortDescription} onChange={handleChange} />
        </div>
  
        <div>
          <label className="block font-medium">Длинное описание</label>
          <Textarea name="longDescription" value={form.longDescription} onChange={handleChange} />
        </div>
  
        <div>
          <label className="block font-medium">Цена</label>
          <Input type="number" name="price" value={form.price} onChange={handleChange} />
        </div>
  
        <div>
          <label className="block font-medium">Цвета</label>
          <div className="flex flex-wrap gap-2">
            {colors.map(c => (
              <label key={c.id} className="flex items-center gap-2">
                <Checkbox checked={form.colorIds.includes(c.id)} onCheckedChange={() => handleCheckboxChange(c.id, 'colorIds')} />
                {c.name}
              </label>
            ))}
          </div>
        </div>
  
        <div>
          <label className="block font-medium">Теги</label>
          <div className="flex flex-wrap gap-2">
            {tags.map(t => (
              <label key={t.id} className="flex items-center gap-2">
                <Checkbox checked={form.tagIds.includes(t.id)} onCheckedChange={() => handleCheckboxChange(t.id, 'tagIds')} />
                {t.name}
              </label>
            ))}
          </div>
        </div>
  
        <div>
          <label className="block font-medium">Изображения</label>
          <Input type="file" multiple onChange={handleFileChange} />
          <div className="flex flex-wrap gap-2 mt-2">
            {serverImages.map((img, i) => (
              <div key={i} className="relative">
                <img src={img.imageUrl} alt="preview" className="w-24 h-24 object-cover rounded" />
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="absolute top-0 right-0"
                  onClick={() => handleRemoveImage(i, img.id === 0)}
                >×</Button>
              </div>
            ))}
          </div>
        </div>
  
        <div className="flex gap-2">
          <Button type="submit">Сохранить</Button>
          <Button type="button" variant="secondary" onClick={onCancel}>Отмена</Button>
        </div>
      </form>
    )
  }
  