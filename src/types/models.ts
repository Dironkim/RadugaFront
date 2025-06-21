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
  statusId: number;
  userId: string;
  salonId: number;
  salonName: string;
  createdAt: string;
  updatedAt: string;
  pendingChange?: PendingOrderChange;
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

export interface PendingOrderChange {
  id: number;
  orderId: number;
  updatedProducts: {
    productId: number;
    productName: string;
    quantity: number;
    currentPrice: number;
    subtotal: number;
    width?: number;
    height?: number;
  }[];
  salonId: number;
  salonName: string;
  createdAt: string;
}

export interface CreateOrderDto {
  statusId: number;
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

export interface OrderStatus {
  id: number;
  codeName: string;
  readableName: string;
  description?: string;
}

export interface Message {
  id: number
  senderId: string
  senderName?: string
  receiverId: string
  text: string
  sentAt: string
  imageUrls: string[]
}