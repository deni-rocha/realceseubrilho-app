import React, { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaCog,
  FaEnvelope,
  FaBell,
  FaStar,
  FaHome,
  FaSignOutAlt,
  FaHeadset,
  FaTimes,
  FaMinus,
  FaPlus,
} from 'react-icons/fa';
import publicApi from '../api/publicApi';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';

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

interface CartItem extends IProduct {
  quantity: number;
  selectedSize?: string;
}

const ProductCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { logout } = useAuthStore();

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

  const categories = useMemo(() => {
    if (!products) return [];
    const uniqueCategories = new Set(products.map((p) => p.category.name));
    return Array.from(uniqueCategories);
  }, [products]);

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

  const updateQuantity = useCallback((itemId: string, change: number) => {
    setCartItems(
      (prevItems) =>
        prevItems
          .map((item) => {
            if (item.id === itemId) {
              const newQuantity = Math.max(0, item.quantity + change);
              if (newQuantity === 0) return null;
              return { ...item, quantity: newQuantity };
            }
            return item;
          })
          .filter(Boolean) as CartItem[],
    );
  }, []);

  const addToCart = useCallback((product: IProduct) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.id === product.id,
      );
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === product.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fcfdfd]">
        <div className="text-xl text-gray-700">Carregando produtos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fcfdfd]">
        <div className="text-xl text-red-600">Erro ao carregar produtos.</div>
      </div>
    );
  }

  // Componente do conteúdo do carrinho (reutilizável)
  const CartContent = () => (
    <>
      {cartItems.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center text-gray-500">
            <FaShoppingCart className="mx-auto h-16 w-16 mb-4 text-gray-300" />
            <p>Seu carrinho está vazio</p>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-6 flex-grow overflow-auto">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-white rounded-3xl p-4 shadow-sm"
              >
                {item.imageUrls && item.imageUrls.length > 0 ? (
                  <img
                    src={item.imageUrls[0]}
                    alt={item.name}
                    className="h-[100px] w-[100px] rounded-2xl bg-[#e0e5ce] object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="h-[100px] w-[100px] rounded-2xl bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-500 text-xs">Sem imagem</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="font-semibold text-sm line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="text-sm text-[#338838] mt-1">
                        {item.category.name}
                      </p>
                      <p className="font-semibold mt-2">
                        R$ {parseFloat(item.price).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => updateQuantity(item.id, -item.quantity)}
                      className="h-8 w-8 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                    >
                      <FaTimes className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                  <div className="flex items-center justify-end">
                    <div className="flex items-center gap-4 bg-[#f7f7f7] rounded-full px-4 py-1">
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label={`Diminuir quantidade de ${item.name}`}
                      >
                        <FaMinus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label={`Aumentar quantidade de ${item.name}`}
                      >
                        <FaPlus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4 border-t pt-6">
            <div className="flex items-center justify-between text-base">
              <p className="text-gray-600">Subtotal</p>
              <p className="font-semibold">R$ {cartTotal.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between text-base">
              <p className="text-gray-600">Frete</p>
              <p className="text-[#338838] font-semibold">GRÁTIS</p>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <p>Total</p>
                <p>R$ {cartTotal.toFixed(2)}</p>
              </div>
            </div>
            <button className="w-full bg-[#415444] hover:bg-[#415444]/90 text-white rounded-2xl h-14 text-lg font-semibold mt-4 transition-colors">
              Finalizar Compra
            </button>
          </div>
        </>
      )}
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#fcfdfd]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 px-6 py-8 hidden lg:block">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#415444]">
            Realce Seu Brilho
          </h1>
        </div>
        <nav className="space-y-6">
          <a
            href="/catalog"
            className="flex items-center gap-3 rounded-lg bg-[#e0e5ce] px-3 py-2 text-[#415444] transition-colors"
          >
            <FaHome className="h-5 w-5" />
            Catálogo
          </a>
          {isAuthenticated && (
            <>
              <a
                href="/customer"
                className="flex items-center gap-3 px-3 py-2 text-gray-500 transition-colors hover:text-gray-900"
              >
                <FaUser className="h-5 w-5" />
                Perfil
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-gray-500 transition-colors hover:text-gray-900"
              >
                <FaCog className="h-5 w-5" />
                Configurações
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-gray-500 transition-colors hover:text-gray-900"
              >
                <FaEnvelope className="h-5 w-5" />
                Mensagens
              </a>
            </>
          )}
          <a
            href="#cart"
            className="flex items-center gap-3 px-3 py-2 text-gray-500 transition-colors hover:text-gray-900"
          >
            <FaShoppingCart className="h-5 w-5" />
            Meu Carrinho
            {cartItems.length > 0 && (
              <span className="ml-auto bg-[#338838] text-white text-xs rounded-full px-2 py-0.5">
                {cartItems.length}
              </span>
            )}
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-gray-500 transition-colors hover:text-gray-900"
          >
            <FaHeadset className="h-5 w-5" />
            Suporte
          </a>
          {isAuthenticated && (
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2 text-red-500 transition-colors hover:text-red-600 w-full"
            >
              <FaSignOutAlt className="h-5 w-5" />
              Sair
            </button>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-8 py-8 overflow-y-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">
              Olá, Cliente! <span className="ml-1">👋</span>
            </h2>
            <p className="text-gray-500">Bem-vindo de volta</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 md:flex-none">
              <FaSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#338838]"
              />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <FaBell className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </header>

        {/* Banner Cards */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#e0e5ce] border-0 rounded-[24px] p-6">
            <p className="mb-2 text-sm font-medium uppercase text-[#338838]">
              MELHORES OFERTAS
            </p>
            <h3 className="mb-4 text-2xl font-semibold">
              Coleção de Produtos de Beleza
            </h3>
            <p className="mb-6 text-gray-600">
              Descubra os melhores produtos segundo sua paixão
            </p>
            <button className="bg-[#415444] hover:bg-[#415444]/90 text-white px-6 py-2 rounded-lg transition-colors">
              Ver Mais
            </button>
          </div>
          <div className="bg-[#e7ddd1] border-0 rounded-[24px] p-6 flex items-center justify-between">
            <div>
              <h3 className="mb-4 text-3xl font-semibold">Promoção ✨</h3>
              <p className="mb-6 text-5xl font-bold">50% OFF</p>
              <button className="bg-[#415444] hover:bg-[#415444]/90 text-white px-6 py-2 rounded-lg transition-colors">
                Compre Agora!
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#415444] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todas
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-[#415444] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mb-8 flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Coleção Popular</h3>
          <button className="text-[#338838] hover:underline">Ver Tudo</button>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Nenhum produto encontrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group border-0 bg-[#e0e5ce] rounded-[24px] overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="p-0 relative">
                  {hoveredProduct === product.id && (
                    <div className="absolute inset-0 bg-black/40 z-10 transition-opacity" />
                  )}
                  {hoveredProduct === product.id && (
                    <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transform transition-all bg-white text-black hover:bg-white/90 px-6 py-2 rounded-lg font-medium">
                      Visualização Rápida
                    </button>
                  )}
                  {product.imageUrls && product.imageUrls.length > 0 ? (
                    <img
                      src={product.imageUrls[0]}
                      alt={product.name}
                      className="h-[280px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-[280px] w-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">Sem imagem</span>
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-1 line-clamp-1">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">(4.8)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[#338838] text-xl font-semibold">
                      R$ {parseFloat(product.price).toFixed(2)}
                    </p>
                    <button
                      onClick={() => addToCart(product)}
                      className="border border-gray-300 px-4 py-2 rounded-full hover:bg-[#415444] hover:text-white hover:border-[#415444] transition-colors text-sm font-medium"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Desktop Cart Sidebar */}
      <aside className="w-80 lg:w-96 border-l border-gray-200 px-6 py-8 flex flex-col overflow-y-auto hidden xl:flex">
        <div className="mb-8 flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Meu Carrinho</h3>
          <button className="border-2 border-gray-300 rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 19L8 12L15 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <CartContent />
      </aside>

      {/* Mobile Cart Modal/Drawer */}
      {isCartOpen && (
        <div className="xl:hidden fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Cart Drawer */}
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#fcfdfd] shadow-2xl flex flex-col animate-slide-in-right">
            <div className="px-6 py-8 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">Meu Carrinho</h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="border-2 border-gray-300 rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <CartContent />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="xl:hidden fixed bottom-6 right-6 bg-[#415444] text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-[#415444]/90 transition-colors z-40"
      >
        <FaShoppingCart className="h-6 w-6" />
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {cartItems.length}
          </span>
        )}
      </button>
    </div>
  );
};

export default ProductCatalog;
