interface IProductCategory {
  id: string;
  name: string;
  description: string | null;
}

interface IProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  stockQuantity: number;
  imageUrls: string[];
  category: IProductCategory;
}

export interface CartItem extends IProduct {
  quantity: number;
  selectedSize?: string;
}
