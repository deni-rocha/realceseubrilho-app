import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaSearch } from 'react-icons/fa';
import { LuRefreshCw } from 'react-icons/lu';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import api from '../../api';
import EditProductForm from './EditProductForm';

interface IProductCategory {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

interface IProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  stockQuantity: number;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
  category: IProductCategory;
}

const ProductList: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'name' | 'category'>('name');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get<IProduct[]>('/products');
      return response.data;
    },
  });

  // Filtrar produtos
  const filteredProducts = useMemo(() => {
    if (!products || !searchTerm) return products;

    return products.filter((product) => {
      const searchValue = searchTerm.toLowerCase();
      switch (filterBy) {
        case 'name':
          return product.name.toLowerCase().includes(searchValue);
        case 'category':
          return product.category.name.toLowerCase().includes(searchValue);
        default:
          return true;
      }
    });
  }, [products, searchTerm, filterBy]);

  const handleEdit = (productId: string) => {
    setEditingProductId(productId);
  };

  const handleEditSuccess = () => {
    setEditingProductId(null);
    refetch();
  };

  // Função para deletar produto
  const handleDelete = async (productId: string) => {
    const deletePromise = new Promise((resolve, reject) => {
      toast.warning(
        ({ closeToast }) => (
          <div>
            <p className="mb-4">Tem certeza que deseja excluir este produto?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  closeToast();
                  reject();
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={() => resolve(productId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        ),
        {
          autoClose: false,
          closeButton: false,
          closeOnClick: false,
        },
      );
    });

    toast.promise(
      deletePromise.then(async () => {
        await api.delete(`/products/${productId}`);
        refetch();
      }),
      {
        pending: 'Excluindo produto...',
        success: 'Produto excluído com sucesso!',
        error: 'Erro ao excluir produto',
      },
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 text-gray-700 dark:text-gray-300">
        Carregando produtos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 dark:text-red-400">
        Erro ao carregar produtos.
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg shadow-md bg-gray-100 dark:bg-accent-dark">
      {editingProductId ? (
        <div className="fixed inset-0 bg-accent-dark flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              Editar Produto
            </h2>
            <EditProductForm
              productId={editingProductId}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingProductId(null)}
            />
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white hidden md:block">
            Lista de Produtos
          </h1>

          {/* Barra de Ações */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => refetch()}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                <span className="font-bold">Atualizar</span>
                <LuRefreshCw />
              </button>

              <button
                onClick={() => setShowSearch(!showSearch)}
                className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                {showSearch ? <IoMdClose /> : <FaSearch />}
              </button>
            </div>

            {/* Barra de Busca */}
            {showSearch && (
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-green-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterBy}
                    onChange={(e) =>
                      setFilterBy(e.target.value as 'name' | 'category')
                    }
                    className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-green-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="name">Nome</option>
                    <option value="category">Categoria</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Lista de Produtos */}
          {filteredProducts?.length === 0 ? (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              Nenhum produto encontrado.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts?.map((product) => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-transform hover:scale-[1.02]"
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
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {product.name}
                      </h3>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        {product.price}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Categoria: {product.category.name}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        Estoque: {product.stockQuantity}
                      </span>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      >
                        Excluir
                      </button>
                      <button
                        onClick={() => handleEdit(product.id)}
                        className="px-3 py-1 text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
