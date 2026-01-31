import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { LuRefreshCw } from 'react-icons/lu';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';

interface Category {
  id: string;
  name: string;
  productsCount?: number;
}

const CategoryList: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get<Category[]>('/product-category');
      return response.data;
    },
  });

  // Filtrar categorias
  const filteredCategories = categories?.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Função para deletar categoria
  const handleDelete = async (categoryId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await api.delete(`/product-category/${categoryId}`);
        toast.success('Categoria excluída com sucesso!');
        refetch();
      } catch (error: any) {
        const message =
          error.response?.data?.message || 'Erro ao excluir categoria';
        toast.error(message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-gray-700 dark:text-gray-300 flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center">
          <FaSpinner className="w-8 h-8 text-green-600 animate-spin mb-2" />
          <span>Carregando categorias...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 dark:text-red-400">
        Erro ao carregar categorias.
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg shadow-md bg-gray-100 dark:bg-accent-dark">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white hidden md:block">
        Lista de Categorias
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
                placeholder="Buscar categorias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-green-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Lista de Categorias */}
      {filteredCategories?.length === 0 ? (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          Nenhuma categoria encontrada.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories?.map((category) => (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-transform hover:scale-[1.02]"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {category.name}
                </h3>
                {category.productsCount !== undefined && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {category.productsCount} produtos
                  </span>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => handleDelete(category.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                  Excluir
                </button>
                <button className="px-3 py-1 text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors">
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
