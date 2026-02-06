import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
  useEffect,
} from 'react';
import type { IProduct, CartItem } from '../types/catalog';
import { useAuth } from './useAuth';
import { cartApi } from '../api/cart';
import { useAuthStore } from '../store/authStore';

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

// Chave para armazenamento local
const CART_STORAGE_KEY = 'cart_items';

// Provider do carrinho
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Obter estado de autenticação
  const { isAuthenticated } = useAuth();
  const user = useAuthStore(state => state.user);
  
  // Estado do carrinho
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Carregar do localStorage apenas se não estiver autenticado
    if (!isAuthenticated) {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Sincronizar carrinho com o backend quando o usuário faz login
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // Limpar carrinho local quando o usuário faz login
      // e buscar o carrinho do backend
      loadCartFromBackend(user.id);
    } else if (!isAuthenticated) {
      // Carregar carrinho do localStorage quando o usuário desloga
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }
  }, [isAuthenticated, user]);

  // Carregar carrinho do backend
  const loadCartFromBackend = async (userId: string) => {
    try {
      const cart = await cartApi.findOrCreateCart(userId);
      const backendCartItems: CartItem[] = cart.cartItems.map(item => ({
        ...item.product,
        quantity: item.quantity,
        selectedSize: 'M', // Valor padrão, pode ser ajustado conforme necessário
      }));
      
      setCartItems(backendCartItems);
    } catch (error) {
      console.error('Erro ao carregar carrinho do backend:', error);
    }
  };

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

  // Sincronizar carrinho com o backend
  const syncCartToBackend = async () => {
    if (!isAuthenticated || !user?.id) return;

    try {
      // Obter carrinho atual do backend
      const cart = await cartApi.findOrCreateCart(user.id);
      const cartId = cart.id;

      // Atualizar/remover itens existentes
      for (const cartItem of cart.cartItems) {
        const localItem = cartItems.find(item => item.id === cartItem.product.id);
        
        if (!localItem) {
          // Item foi removido localmente, remover do backend
          await cartApi.removeProduct(cartId, cartItem.product.id);
        } else {
          // Item existe, verificar se a quantidade mudou
          if (localItem.quantity !== cartItem.quantity) {
            await cartApi.updateProductQuantity(cartId, cartItem.product.id, {
              quantity: localItem.quantity,
            });
          }
        }
      }

      // Adicionar novos itens
      for (const localItem of cartItems) {
        const backendItem = cart.cartItems.find(item => item.product.id === localItem.id);
        
        if (!backendItem) {
          // Novo item, adicionar ao backend
          await cartApi.addProduct(cartId, {
            productId: localItem.id,
            quantity: localItem.quantity,
          });
        }
      }
    } catch (error) {
      console.error('Erro ao sincronizar carrinho com backend:', error);
    }
  };

  // Debounce para sincronização com o backend
  const debouncedSyncCartToBackend = useCallback(() => {
    // Cancelar chamada anterior se ainda estiver pendente
    if ((window as any).cartSyncTimeout) {
      clearTimeout((window as any).cartSyncTimeout);
    }

    // Agendar nova chamada
    (window as any).cartSyncTimeout = setTimeout(() => {
      syncCartToBackend();
    }, 1000); // 1 segundo de delay
  }, [syncCartToBackend, cartItems, isAuthenticated, user]);

  // Salvar carrinho no localStorage sempre que ele mudar (se não estiver autenticado)
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } else {
      // Quando o usuário está autenticado, salvar no backend com debounce
      debouncedSyncCartToBackend();
    }
  }, [cartItems, isAuthenticated]);

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

          const updatedItems = prevItems.map((cartItem) =>
            cartItem.id === product.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem,
          );
          
          return updatedItems;
        }

        // Verificar estoque antes de adicionar novo item
        if (product.stockQuantity < 1) {
          showToast('Produto sem estoque!', 'error');
          return prevItems;
        }

        // Adicionar novo item
        showToast(`${product.name} adicionado ao carrinho!`, 'success');

        const newItems = [
          ...prevItems,
          {
            ...product,
            quantity: 1,
            selectedSize: 'M',
          } as CartItem,
        ];
        
        return newItems;
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