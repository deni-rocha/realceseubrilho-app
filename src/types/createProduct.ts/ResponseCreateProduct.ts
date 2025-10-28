import type { ResponseCreateCategory } from './ResponseCreateCategory';

export interface ResponseCreateProduct {
  id: string;
  name: string;
  description: string;
  price: string; // ou number se converter para decimal
  stockQuantity: number;
  imageUrl: string | null;
  createdAt: string; // ou Date se converter
  updatedAt: string; // ou Date se converter
  category: ResponseCreateCategory;
}
