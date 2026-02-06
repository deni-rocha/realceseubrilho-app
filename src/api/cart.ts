import api from './index';

// Interfaces para tipagem
interface CartItem {
  id: string;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    cost?: string;
    stockQuantity: number;
    imageUrls: string[];
    categories: {
      id: string;
      name: string;
      description: string | null;
    }[];
    isFeatured?: boolean;
    isOnSale?: boolean;
    salePrice?: string;
  };
}

interface ShoppingCart {
  id: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  cartItems: CartItem[];
}

interface AddProductToCartPayload {
  productId: string;
  quantity: number;
}

interface UpdateCartItemQuantityPayload {
  quantity: number;
}

// Funções de API para o carrinho
export const cartApi = {
  // Buscar ou criar carrinho do usuário
  findOrCreateCart: async (userId: string): Promise<ShoppingCart> => {
    const response = await api.get<ShoppingCart>(`/shopping-cart/user/${userId}`);
    return response.data;
  },

  // Buscar detalhes do carrinho
  getCartDetails: async (cartId: string): Promise<ShoppingCart> => {
    const response = await api.get<ShoppingCart>(`/shopping-cart/${cartId}`);
    return response.data;
  },

  // Adicionar produto ao carrinho
  addProduct: async (
    cartId: string,
    payload: AddProductToCartPayload
  ): Promise<CartItem> => {
    const response = await api.post<CartItem>(`/shopping-cart/${cartId}/items`, payload);
    return response.data;
  },

  // Atualizar quantidade de produto no carrinho
  updateProductQuantity: async (
    cartId: string,
    productId: string,
    payload: UpdateCartItemQuantityPayload
  ): Promise<CartItem> => {
    const response = await api.patch<CartItem>(
      `/shopping-cart/${cartId}/items/${productId}`,
      payload
    );
    return response.data;
  },

  // Remover produto do carrinho
  removeProduct: async (cartId: string, productId: string): Promise<void> => {
    await api.delete(`/shopping-cart/${cartId}/items/${productId}`);
  },

  // Esvaziar carrinho
  clearCart: async (cartId: string): Promise<void> => {
    await api.delete(`/shopping-cart/${cartId}/items`);
  },

  // Calcular total do carrinho
  calculateCartTotal: async (cartId: string): Promise<{ total: string }> => {
    const response = await api.get<{ total: string }>(`/shopping-cart/${cartId}/total`);
    return response.data;
  },
};

export default cartApi;