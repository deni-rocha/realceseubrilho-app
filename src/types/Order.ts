export interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: {
    id: string;
    name: string;
    price: string;
    description?: string;
    imageUrls?: string[];
  };
}

export interface Order {
  id: string;
  userId: string;
  orderDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  orderItems: OrderItem[];
  user?: {
    id: string;
    name: string;
    email: string;
    whatsapp?: string;
  };
  guestName?: string;
  guestWhatsapp?: string;
}
