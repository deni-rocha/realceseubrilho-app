import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import publicApi from '../../api/publicApi';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { createGuestOrder } from '../../api/orders';
import type {
  IProduct,
  CartItem,
  GuestCheckoutData,
} from '../../types/catalog';

// Import reusable components
import Sidebar from '../../components/home/Sidebar';
import Header from '../../components/home/Header';
import BannerCards from '../../components/home/BannerCards';
import AdvancedFilter, {
  type FilterOptions,
} from '../../components/home/AdvancedFilter';
import ActiveFilterBadges from '../../components/home/ActiveFilterBadges';
import ProductCard from '../../components/home/ProductCard';
import CartContent from '../../components/home/CartContent';
import CartDrawer from '../../components/home/CartDrawer';
import GuestCheckoutModal from '../../components/home/GuestCheckoutModal';
import BottomNavigationBar from '../../components/home/BottomNavigationBar';
import ProfileBar from '../../components/home/ProfileBar';
import MobileSearchBar from '../../components/home/MobileSearchBar';
import Toast, { type ToastType } from '../../components/home/Toast';

const Home: React.FC = () => {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState<FilterOptions['sortBy']>('newest');
  const [inStockOnly, setInStockOnly] = useState(false);
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
  const user = useAuthStore((state: any) => state.user);

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

  // Calculate max price from products
  const maxPrice = useMemo(() => {
    if (!products || products.length === 0) return 1000;
    return Math.ceil(
      Math.max(...products.map((p: IProduct) => parseFloat(p.price))),
    );
  }, [products]);

  // Initialize price range when products load
  useEffect(() => {
    if (products && products.length > 0) {
      setPriceRange({ min: 0, max: maxPrice });
    }
  }, [products, maxPrice]);

  // Extract categories from products
  const categories = useMemo(() => {
    if (!products) return [];
    const uniqueCategories = new Set<string>();
    products.forEach((p: IProduct) => {
      p.categories?.forEach((cat: any) => uniqueCategories.add(cat.name));
    });
    return Array.from(uniqueCategories);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products.filter((product: IProduct) => {
      // Search filter
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Category filter - if no categories selected, show all
      const matchesCategory =
        selectedCategories.length === 0 ||
        (product.categories &&
          product.categories.some((cat: any) =>
            selectedCategories.includes(cat.name),
          ));

      // Price filter
      const productPrice = parseFloat(product.price);
      const matchesPrice =
        productPrice >= priceRange.min && productPrice <= priceRange.max;

      // Stock filter
      const matchesStock = !inStockOnly || product.stockQuantity > 0;

      return matchesSearch && matchesCategory && matchesPrice && matchesStock;
    });

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-desc':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'newest':
        default:
          return 0; // Keep original order
      }
    });

    return sorted;
  }, [
    products,
    searchTerm,
    selectedCategories,
    priceRange,
    sortBy,
    inStockOnly,
  ]);

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

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: maxPrice });
    setSortBy('newest');
    setInStockOnly(false);
  }, [maxPrice]);

  // Remove individual filters
  const handleRemoveCategory = useCallback((category: string) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== category));
  }, []);

  const handleRemovePriceFilter = useCallback(() => {
    setPriceRange({ min: 0, max: maxPrice });
  }, [maxPrice]);

  const handleRemoveSortFilter = useCallback(() => {
    setSortBy('newest');
  }, []);

  const handleRemoveStockFilter = useCallback(() => {
    setInStockOnly(false);
  }, []);

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
            {/* Banner Cards - Hide when searching (mobile) */}
            {!searchTerm && mobileActiveTab !== 'search' && <BannerCards />}

            {/* Advanced Filter and Products Layout */}
            <div className="flex flex-col lg:flex-row gap-6 mt-8">
              {/* Filter Sidebar */}
              <div className="w-full lg:w-64 lg:flex-shrink-0">
                <div className="lg:sticky lg:top-4">
                  <AdvancedFilter
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onCategoriesChange={setSelectedCategories}
                    priceRange={priceRange}
                    onPriceRangeChange={setPriceRange}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    inStockOnly={inStockOnly}
                    onInStockChange={setInStockOnly}
                    onClearFilters={handleClearFilters}
                    productCount={filteredProducts.length}
                    maxPrice={maxPrice}
                  />
                </div>
              </div>

              {/* Products Section */}
              <div className="flex-1 min-w-0">
                {/* Active Filter Badges */}
                <ActiveFilterBadges
                  selectedCategories={selectedCategories}
                  priceRange={priceRange}
                  sortBy={sortBy}
                  inStockOnly={inStockOnly}
                  maxPrice={maxPrice}
                  onRemoveCategory={handleRemoveCategory}
                  onRemovePriceFilter={handleRemovePriceFilter}
                  onRemoveSortFilter={handleRemoveSortFilter}
                  onRemoveStockFilter={handleRemoveStockFilter}
                  onClearAll={handleClearFilters}
                />

                {/* Section Header */}
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-2xl font-semibold">
                    {selectedCategories.length > 0
                      ? selectedCategories.join(', ')
                      : 'Todos os Produtos'}
                  </h3>
                  <span className="text-sm text-gray-600">
                    {filteredProducts.length}{' '}
                    {filteredProducts.length === 1 ? 'produto' : 'produtos'}
                  </span>
                </div>

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-lg mb-2">Nenhum produto encontrado.</p>
                    <button
                      onClick={handleClearFilters}
                      className="text-[#338838] hover:underline text-sm font-medium"
                    >
                      Limpar filtros
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
                    {filteredProducts.map((product: IProduct) => (
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
              </div>
            </div>
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

export default Home;
