// src/types/models.ts

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  shortDescription?: string;
  longDescription?: string;
  requiresSize: boolean;
  tailoringFee?: number;
  price: number;
  tagIds: number[];
  colorIds: number[];
  imagePaths: string[];
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  productIds: number[];
}

export interface Tag {
  id: number;
  name: string;
  productIds: number[];
}

export interface Color {
  id: number;
  name: string;
  productIds: number[];
}

export interface Image {
  id: number;
  productId?: number;
  imageUrl: string;
}

export interface Order {
  id: number;
  status: string;
  userId: string;
  salonId: number;
  salonName: string;
  createdAt: string;
  updatedAt: string;
  orderProducts: {
    productId: number;
    productName: string;
    quantity: number;
    currentPrice: number;
    subtotal: number;
    width?: number;
    height?: number;
  }[];
}
export interface CreateOrderDto {
  status: string;
  userId: string;
  salonId: number;
  orderProducts: {
    productId: number;
    quantity: number;
    width?: number;
    height?: number;
  }[];
}
export interface Salon {
  id: number;
  name: string;
  address: string;
}
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
  role: string;
}

