import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import type { ResponseCreateProduct } from '../types/createProduct.ts/ResponseCreateProduct';

interface FeaturedProductsProps {
  limit?: number;
  className?: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  limit,
  className = '',
}) => {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const response = await api.get<ResponseCreateProduct[]>(
        '/products/public/featured',
      );
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-8 text-red-600 dark:text-red-400">
          Erro ao carregar produtos em destaque.
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
          ⭐ Produtos em Destaque
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Confira nossa seleção especial de produtos
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-xl"
          >
            {/* Badge de Destaque */}
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

              {/* Badge superior */}
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full shadow-lg">
                  ⭐ DESTAQUE
                </span>
              </div>

              {/* Badge de promoção se aplicável */}
              {product.isOnSale && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                    🔥 PROMOÇÃO
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
                      className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded"
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

              {/* Preço */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                {product.isOnSale && product.salePrice ? (
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                        De: R$ {product.price}
                      </p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        Por: R$ {product.salePrice}
                      </p>
                    </div>
                    <div className="text-right">
                      {(() => {
                        const discount = Math.round(
                          ((parseFloat(product.price) -
                            parseFloat(product.salePrice)) /
                            parseFloat(product.price)) *
                            100,
                        );
                        return (
                          <span className="inline-block px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs font-bold rounded">
                            -{discount}%
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    R$ {product.price}
                  </p>
                )}

                {/* Estoque */}
                <div className="mt-3">
                  {product.stockQuantity > 0 ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {product.stockQuantity > 10
                        ? 'Em estoque'
                        : `Apenas ${product.stockQuantity} ${product.stockQuantity === 1 ? 'unidade' : 'unidades'} disponível`}
                    </p>
                  ) : (
                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                      Fora de estoque
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
