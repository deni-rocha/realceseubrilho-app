import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaSpinner, FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import publicApi from '../../api/publicApi';
import type { IProduct } from '../../types/catalog';
import ProductCard from '../../components/home/ProductCard';
import BottomNavigationBar from '../../components/home/BottomNavigationBar';
import { useCart } from '../../hooks/useCart';

// Custom hook for debouncing
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Debounce the search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

  // Cart Hook
  const { addToCart, cartItemsCount } = useCart();

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

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!products || !debouncedSearchTerm) return [];

    const term = debouncedSearchTerm.toLowerCase();
    return products.filter(
      (product: IProduct) =>
        product.name.toLowerCase().includes(term) ||
        (product.description &&
          product.description.toLowerCase().includes(term)) ||
        (product.categories &&
          product.categories.some((cat: any) =>
            cat.name.toLowerCase().includes(term),
          )),
    );
  }, [products, debouncedSearchTerm]);

  // Navigation
  const navigate = useNavigate();

  // Handle mobile tab change
  const handleMobileTabChange = useCallback(
    (tab: 'home' | 'search' | 'cart' | 'profile') => {
      if (tab === 'cart') {
        navigate('/cart');
      } else if (tab === 'home') {
        navigate('/home');
      } else if (tab === 'profile') {
        navigate('/profile');
      }
      // Stay on search page for 'search' tab
    },
    [navigate],
  );

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-[#fcfdfd]">
      {/* Search Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 p-4">
        <div className="relative max-w-4xl mx-auto">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#415444] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                }
              }}
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="p-4 pb-24">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center">
              <FaSpinner className="w-8 h-8 text-green-600 animate-spin mb-2" />
              <span className="text-xl text-gray-700">
                Buscando produtos...
              </span>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-xl text-red-600">Erro ao buscar produtos.</div>
          </div>
        ) : (
          <>
            {debouncedSearchTerm && (
              <div className="mb-4">
                <p className="text-gray-600">
                  {filteredProducts.length}{' '}
                  {filteredProducts.length === 1 ? 'resultado' : 'resultados'}{' '}
                  para "{debouncedSearchTerm}"
                </p>
              </div>
            )}

            {filteredProducts.length === 0 && debouncedSearchTerm ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600 mb-4">
                  Nenhum produto encontrado para "{debouncedSearchTerm}"
                </p>
                <button
                  onClick={clearSearch}
                  className="px-4 py-2 bg-[#415444] text-white rounded-full hover:bg-[#338838] transition-colors"
                >
                  Limpar busca
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
          </>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigationBar
        activeTab="search"
        cartItemsCount={cartItemsCount}
        onTabChange={handleMobileTabChange}
        onClearSearch={clearSearch}
      />
    </div>
  );
};

export default SearchPage;
