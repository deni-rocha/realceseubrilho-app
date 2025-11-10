import publicApi from './publicApi';
import type { CartItem } from '../types/catalog';

interface GuestOrderItem {
  productId: string;
  quantity: number;
}

interface CreateGuestOrderDto {
  guestName: string;
  guestWhatsapp: string;
  items: GuestOrderItem[];
}

interface CreateGuestOrderResponse {
  message: string;
  whatsappUrl: string;
  orderDetails: {
    id: string;
    guestName: string;
    guestWhatsapp: string;
    orderDate: string;
    status: string;
    totalAmount: number;
    shippingAddress: string;
    paymentMethod: string;
    orderItems: Array<{
      id: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
      product: {
        id: string;
        name: string;
        price: string;
      };
    }>;
  };
}

export const createGuestOrder = async (
  guestName: string,
  guestWhatsapp: string,
  cartItems: CartItem[],
): Promise<CreateGuestOrderResponse> => {
  const items: GuestOrderItem[] = cartItems.map((item) => ({
    productId: item.id,
    quantity: item.quantity,
  }));

  const payload: CreateGuestOrderDto = {
    guestName,
    guestWhatsapp,
    items,
  };

  const response = await publicApi.post<CreateGuestOrderResponse>(
    '/orders/guest',
    payload,
  );

  return response.data;
};

export const createOrderFromCart = async (userId: string) => {
  const response = await publicApi.post('/orders', { userId });
  return response.data;
};
