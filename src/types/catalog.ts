export interface IProductCategory {
  id: string;
  name: string;
  description: string | null;
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  cost?: string;
  stockQuantity: number;
  imageUrls: string[];
  categories: IProductCategory[];
  isFeatured?: boolean;
  isOnSale?: boolean;
  salePrice?: string;
}

export interface CartItem extends IProduct {
  quantity: number;
  selectedSize?: string;
}

export interface GuestCheckoutData {
  guestName: string;
  guestWhatsapp: string;
}
