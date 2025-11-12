import type { ResponseCreateCategory } from './ResponseCreateCategory';

export interface ResponseCreateProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  cost?: number;
  stockQuantity: number;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
  categories: ResponseCreateCategory[];
}
