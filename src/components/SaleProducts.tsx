import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaSpinner } from 'react-icons/fa';
import api from '../api';
import type { ResponseCreateProduct } from '../types/createProduct.ts/ResponseCreateProduct';

interface SaleProductsProps {
  limit?: number;
  className?: string;
}

const SaleProducts: React.FC<SaleProductsProps> = ({
  limit,
  className = '',
}) => {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products', 'on-sale'],
    queryFn: async () => {
      const response = await api.get<ResponseCreateProduct[]>(
        '/products/public/on-sale',
      );
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className={`${className} flex items-center justify-center py-12`}>
        <div className="flex flex-col items-center">
          <FaSpinner className="w-8 h-8 text-red-600 animate-spin mb-2" />
          <span>Carregando produtos em promoção...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-8 text-red-600 dark:text-red-400">
          Erro ao carregar produtos em promoção.
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  const displayProducts = limit ? products.slice(0, limit) : products;

  return (
    <div className={`${className}`}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          🔥 Produtos em Promoção
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Aproveite nossas ofertas especiais com preços imperdíveis
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayProducts.map((product) => {
          // Calcular desconto percentual
          const discount = product.salePrice
            ? Math.round(
                ((parseFloat(product.price) - parseFloat(product.salePrice)) /
                  parseFloat(product.price)) *
                  100,
              )
            : 0;

          return (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-xl border-2 border-red-200 dark:border-red-900"
            >
              {/* Imagem e Badges */}
              <div className="relative">
                {product.imageUrls && product.imageUrls.length > 0 ? (
                  <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <img
                      src={product.imageUrls[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-500 text-lg">
                      Sem imagem
                    </span>
                  </div>
                )}

                {/* Badge de Promoção */}
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                    🔥 PROMOÇÃO
                  </span>
                </div>

                {/* Badge de Desconto */}
                {discount > 0 && (
                  <div className="absolute top-3 left-3">
                    <div className="bg-yellow-400 text-gray-900 font-black text-lg px-3 py-2 rounded-full shadow-lg">
                      -{discount}%
                    </div>
                  </div>
                )}

                {/* Badge de Destaque (se aplicável) */}
                {product.isFeatured && (
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-flex items-center px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded shadow-lg">
                      ⭐ DESTAQUE
                    </span>
                  </div>
                )}
              </div>

              {/* Conteúdo do Card */}
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem]">
                  {product.name}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 min-h-[4rem]">
                  {product.description}
                </p>

                {/* Categorias */}
                {product.categories && product.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.categories.slice(0, 2).map((category) => (
                      <span
                        key={category.id}
                        className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded"
                      >
                        {category.name}
                      </span>
                    ))}
                    {product.categories.length > 2 && (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded">
                        +{product.categories.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Preços */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="mb-3">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        De:
                      </span>
                      <span className="text-lg text-gray-500 dark:text-gray-400 line-through font-medium">
                        R$ {product.price}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-red-600 dark:text-red-400 font-semibold">
                        Por:
                      </span>
                      <span className="text-3xl font-black text-red-600 dark:text-red-400">
                        R$ {product.salePrice || product.price}
                      </span>
                    </div>
                  </div>

                  {/* Economia */}
                  {product.salePrice && (
                    <div className="mb-3">
                      <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                        💰 Economize R${' '}
                        {(
                          parseFloat(product.price) -
                          parseFloat(product.salePrice)
                        ).toFixed(2)}
                      </p>
                    </div>
                  )}

                  {/* Estoque */}
                  <div className="mt-3">
                    {product.stockQuantity > 0 ? (
                      <div>
                        {product.stockQuantity <= 10 ? (
                          <p className="text-xs text-orange-600 dark:text-orange-400 font-bold animate-pulse">
                            ⚠️ Últimas {product.stockQuantity}{' '}
                            {product.stockQuantity === 1
                              ? 'unidade'
                              : 'unidades'}
                            !
                          </p>
                        ) : (
                          <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                            ✓ Em estoque
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-red-600 dark:text-red-400 font-bold">
                        ✗ Fora de estoque
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SaleProducts;
