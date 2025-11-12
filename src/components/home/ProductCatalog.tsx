import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import publicApi from '../../api/publicApi';

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

const ProductCatalog: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

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

  // Obter categorias únicas
  const categories = useMemo(() => {
    if (!products) return [];
    const uniqueCategories = new Set(products.map((p) => p.category.name));
    return Array.from(uniqueCategories);
  }, [products]);

  // Filtrar produtos
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-700 dark:text-gray-300">
          Carregando produtos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600 dark:text-red-400">
          Erro ao carregar produtos.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-primary-dark">
      {/* Modal de Detalhes do Produto */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {selectedProduct.name}
              </h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <IoMdClose size={24} />
              </button>
            </div>

            {/* Imagens do produto */}
            {selectedProduct.imageUrls &&
              selectedProduct.imageUrls.length > 0 && (
                <div className="mb-4">
                  <img
                    src={selectedProduct.imageUrls[0]}
                    alt={selectedProduct.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </div>
              )}

            <div className="space-y-4">
              <div>
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                  R$ {selectedProduct.price}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Descrição
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedProduct.description}
                </p>
              </div>

              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Categoria: {selectedProduct.category.name}
                </span>
              </div>

              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Disponível: {selectedProduct.stockQuantity} unidades
                </span>
              </div>

              <button className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <FaShoppingCart />
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="bg-white dark:bg-accent-dark shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Catálogo de Produtos
          </h1>

          {/* Barra de Busca e Filtros */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                {showSearch ? <IoMdClose /> : <FaSearch />}
              </button>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-green-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="all">Todas as Categorias</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {showSearch && (
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-green-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            )}
          </div>
        </div>
      </div>

      {/* Grid de Produtos */}
      <div className="container mx-auto px-4 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Nenhum produto encontrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                {/* Imagem do Produto */}
                {product.imageUrls && product.imageUrls.length > 0 ? (
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <img
                      src={product.imageUrls[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-500">
                      Sem imagem
                    </span>
                  </div>
                )}

                {/* Conteúdo do Card */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">
                      R$ {product.price}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {product.category.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;
