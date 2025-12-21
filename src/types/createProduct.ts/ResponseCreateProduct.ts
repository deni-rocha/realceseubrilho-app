import type { ResponseCreateCategory } from './ResponseCreateCategory';

export interface ResponseCreateProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  cost?: string;
  stockQuantity: number;
  isFeatured?: boolean;
  isOnSale?: boolean;
  salePrice?: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
  categories: ResponseCreateCategory[];
}
