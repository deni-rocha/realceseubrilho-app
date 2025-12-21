import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { IProduct, CartItem } from '../types/catalog';

// Tipo para as notificações de toast
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  message: string;
  type: ToastType;
}

// Interface do contexto do carrinho
interface CartContextType {
  // Estado do carrinho
  cartItems: CartItem[];
  cartTotal: number;
  cartItemsCount: number;

  // Ações do carrinho
  addToCart: (product: IProduct) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, change: number) => void;
  clearCart: () => void;

  // Estado do drawer/modal do carrinho
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCartVisible: boolean;
  setIsCartVisible: (visible: boolean) => void;

  // Toast/Notificações
  toast: ToastMessage | null;
  setToast: (toast: ToastMessage | null) => void;
  showToast: (message: string, type: ToastType) => void;
}

// Criar o contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Props do provider
interface CartProviderProps {
  children: ReactNode;
}

// Provider do carrinho
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Estado do carrinho
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Função auxiliar para mostrar toast
  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  // Calcular total do carrinho
  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      // Usar preço promocional se disponível
      const price = item.salePrice
        ? parseFloat(item.salePrice)
        : parseFloat(item.price);
      return total + price * item.quantity;
    }, 0);
  }, [cartItems]);

  // Contagem de itens no carrinho
  const cartItemsCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  // Adicionar ao carrinho
  const addToCart = useCallback(
    (product: IProduct) => {
      setCartItems((prevItems) => {
        const existingItem = prevItems.find(
          (cartItem) => cartItem.id === product.id,
        );

        if (existingItem) {
          // Verificar se já não atingiu o limite de estoque
          if (existingItem.quantity >= product.stockQuantity) {
            showToast(
              `Estoque limitado! Disponível: ${product.stockQuantity} unidades`,
              'warning',
            );
            return prevItems;
          }

          // Incrementar quantidade
          showToast(`${product.name} adicionado ao carrinho!`, 'success');

          return prevItems.map((cartItem) =>
            cartItem.id === product.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem,
          );
        }

        // Verificar estoque antes de adicionar novo item
        if (product.stockQuantity < 1) {
          showToast('Produto sem estoque!', 'error');
          return prevItems;
        }

        // Adicionar novo item
        showToast(`${product.name} adicionado ao carrinho!`, 'success');

        return [
          ...prevItems,
          {
            ...product,
            quantity: 1,
            selectedSize: 'M',
          } as CartItem,
        ];
      });
    },
    [showToast],
  );

  // Remover do carrinho
  const removeFromCart = useCallback(
    (itemId: string) => {
      setCartItems((prevItems) => {
        const item = prevItems.find((i) => i.id === itemId);
        if (item) {
          showToast(`${item.name} removido do carrinho`, 'info');
        }
        return prevItems.filter((item) => item.id !== itemId);
      });
    },
    [showToast],
  );

  // Atualizar quantidade
  const updateQuantity = useCallback(
    (itemId: string, change: number) => {
      setCartItems(
        (prevItems) =>
          prevItems
            .map((item) => {
              if (item.id === itemId) {
                const newQuantity = Math.max(0, item.quantity + change);

                if (newQuantity === 0) {
                  return null;
                }

                // Verificar se não ultrapassa o estoque disponível
                if (newQuantity > item.stockQuantity) {
                  showToast(
                    `Estoque limitado! Disponível: ${item.stockQuantity} unidades`,
                    'warning',
                  );
                  return item;
                }

                return { ...item, quantity: newQuantity };
              }
              return item;
            })
            .filter(Boolean) as CartItem[],
      );
    },
    [showToast],
  );

  // Limpar carrinho
  const clearCart = useCallback(() => {
    setCartItems([]);
    showToast('Carrinho limpo!', 'info');
  }, [showToast]);

  // Valor do contexto
  const value: CartContextType = {
    cartItems,
    cartTotal,
    cartItemsCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    isCartVisible,
    setIsCartVisible,
    toast,
    setToast,
    showToast,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook para usar o carrinho
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }

  return context;
};

export default useCart;
