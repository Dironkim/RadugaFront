// src/types/models.ts

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  shortDescription?: string;
  longDescription?: string;
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
