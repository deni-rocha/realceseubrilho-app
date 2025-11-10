import React, { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import publicApi from '../api/publicApi';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import { createGuestOrder } from '../api/orders';
import type { IProduct, CartItem, GuestCheckoutData } from '../types/catalog';

// Import reusable components
import Sidebar from './catalog/Sidebar';
import Header from './catalog/Header';
import BannerCards from './catalog/BannerCards';
import CategoryFilter from './catalog/CategoryFilter';
import ProductCard from './catalog/ProductCard';
import CartContent from './catalog/CartContent';
import CartDrawer from './catalog/CartDrawer';
import GuestCheckoutModal from './catalog/GuestCheckoutModal';
import BottomNavigationBar from './catalog/BottomNavigationBar';
import ProfileBar from './catalog/ProfileBar';
import MobileSearchBar from './catalog/MobileSearchBar';
import Toast, { type ToastType } from './catalog/Toast';

const ProductCatalog: React.FC = () => {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<
    'home' | 'search' | 'cart' | 'profile'
  >('home');
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  // Auth
  const { isAuthenticated } = useAuth();
  const { logout } = useAuthStore();
  const user = useAuthStore((state) => state.user);

  // Fetch products
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['publicProducts'],
    queryFn: async () => {
      const response = await publicApi.get<IProduct[]>('/products/public');
      return response.data;
    },
  });

  // Create guest order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (data: GuestCheckoutData) => {
      return await createGuestOrder(
        data.guestName,
        data.guestWhatsapp,
        cartItems,
      );
    },
    onSuccess: (data) => {
      // Limpar carrinho
      setCartItems([]);
      setIsCheckoutModalOpen(false);
      setIsCartOpen(false);

      // Redirecionar para WhatsApp
      window.location.href = data.whatsappUrl;
    },
    onError: (error: any) => {
      console.error('Erro ao criar pedido:', error);
      alert(
        error.response?.data?.message ||
          'Erro ao criar pedido. Tente novamente.',
      );
    },
  });

  // Extract categories from products
  const categories = useMemo(() => {
    if (!products) return [];
    const uniqueCategories = new Set(products.map((p) => p.category.name));
    return Array.from(uniqueCategories);
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' ||
        product.category.name === selectedCategory;
      return matchesSearch && matchesCategory && product.stockQuantity > 0;
    });
  }, [products, searchTerm, selectedCategory]);

  // Cart handlers
  const updateQuantity = useCallback((itemId: string, change: number) => {
    setCartItems(
      (prevItems) =>
        prevItems
          .map((item) => {
            if (item.id === itemId) {
              const newQuantity = Math.max(0, item.quantity + change);
              if (newQuantity === 0) return null;

              // Verificar se não ultrapassa o estoque disponível
              if (newQuantity > item.stockQuantity) {
                setToast({
                  message: `Estoque limitado! Disponível: ${item.stockQuantity} unidades`,
                  type: 'warning',
                });
                return item; // Mantém a quantidade atual
              }

              return { ...item, quantity: newQuantity };
            }
            return item;
          })
          .filter(Boolean) as CartItem[],
    );
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  const addToCart = useCallback((product: IProduct) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.id === product.id,
      );
      if (existingItem) {
        // Verificar se já não atingiu o limite de estoque
        if (existingItem.quantity >= product.stockQuantity) {
          setToast({
            message: `Estoque limitado! Disponível: ${product.stockQuantity} unidades`,
            type: 'warning',
          });
          return prevItems; // Não adiciona mais
        }

        // Adicionar notificação de sucesso ao incrementar
        setToast({
          message: `${product.name} adicionado ao carrinho!`,
          type: 'success',
        });

        return prevItems.map((cartItem) =>
          cartItem.id === product.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }

      // Verificar estoque antes de adicionar novo item
      if (product.stockQuantity < 1) {
        setToast({
          message: 'Produto sem estoque!',
          type: 'error',
        });
        return prevItems;
      }

      // Adicionar notificação de sucesso
      setToast({
        message: `${product.name} adicionado ao carrinho!`,
        type: 'success',
      });

      return [...prevItems, { ...product, quantity: 1, selectedSize: 'M' }];
    });
  }, []);

  const calculateTotal = useCallback((items: CartItem[]) => {
    return items.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0,
    );
  }, []);

  const cartTotal = calculateTotal(cartItems);

  // Checkout handlers
  const handleCheckout = useCallback(() => {
    if (cartItems.length === 0) return;
    setIsCheckoutModalOpen(true);
  }, [cartItems]);

  const handleConfirmCheckout = useCallback(
    (data: GuestCheckoutData) => {
      createOrderMutation.mutate(data);
    },
    [createOrderMutation],
  );

  // Mobile tab handler
  const handleMobileTabChange = useCallback(
    (tab: 'home' | 'search' | 'cart' | 'profile') => {
      setMobileActiveTab(tab);
      if (tab === 'cart') {
        setIsCartOpen(true);
      } else {
        setIsCartOpen(false);
      }
    },
    [],
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fcfdfd]">
        <div className="text-xl text-gray-700">Carregando produtos...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fcfdfd]">
        <div className="text-xl text-red-600">Erro ao carregar produtos.</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#fcfdfd]">
      {/* Sidebar - Desktop */}
      <Sidebar
        isAuthenticated={isAuthenticated}
        cartItemsCount={cartItems.length}
        onLogout={logout}
      />

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-8 py-8 overflow-y-auto pb-20 lg:pb-8">
        {/* Mobile Profile Bar - Only show when profile tab is active */}
        {mobileActiveTab === 'profile' && (
          <ProfileBar
            isAuthenticated={isAuthenticated}
            userName={user?.name}
            userEmail={user?.email}
            onLogout={logout}
          />
        )}

        {/* Mobile Search Bar - Only show when search tab is active */}
        {mobileActiveTab === 'search' && (
          <MobileSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onClose={() => setMobileActiveTab('home')}
            onClear={() => setSearchTerm('')}
          />
        )}

        {/* Header - Desktop only */}
        <div className="hidden lg:block">
          <Header
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            userName={user?.name || 'Cliente'}
          />
        </div>

        {/* Main Content - Hide when profile tab is active on mobile */}
        {(mobileActiveTab === 'home' ||
          mobileActiveTab === 'search' ||
          window.innerWidth >= 1024) && (
          <>
            {/* Banner Cards - Hide when searching */}
            {!searchTerm && <BannerCards />}

            {/* Category Filter */}
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            {/* Section Header */}
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Coleção Popular</h3>
              <button className="text-[#338838] hover:underline">
                Ver Tudo
              </button>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Nenhum produto encontrado.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isHovered={hoveredProduct === product.id}
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    onAddToCart={() => addToCart(product)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Desktop Cart Sidebar */}
      <aside className="w-80 lg:w-96 border-l border-gray-200 px-6 py-8 flex-col overflow-y-auto hidden xl:flex">
        <div className="mb-8 flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Meu Carrinho</h3>
        </div>
        <CartContent
          cartItems={cartItems}
          cartTotal={cartTotal}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onCheckout={handleCheckout}
          isCheckoutDisabled={cartItems.length === 0}
        />
      </aside>

      {/* Mobile Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => {
          setIsCartOpen(false);
          setMobileActiveTab('home');
        }}
        cartItems={cartItems}
        cartTotal={cartTotal}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
        isCheckoutDisabled={cartItems.length === 0}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNavigationBar
        activeTab={mobileActiveTab}
        cartItemsCount={cartItems.length}
        onTabChange={handleMobileTabChange}
      />

      {/* Guest Checkout Modal */}
      <GuestCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onConfirm={handleConfirmCheckout}
        isLoading={createOrderMutation.isPending}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ProductCatalog;
