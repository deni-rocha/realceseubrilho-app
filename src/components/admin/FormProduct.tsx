import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../../api';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

// Interface para categoria
interface Category {
  id: string;
  name: string;
}

// Schema de validação
const productSchema = z.object({
  name: z
    .string()
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .max(50, 'O nome deve ter no máximo 50 caracteres'),
  description: z
    .string()
    .min(10, 'A descrição deve ter no mínimo 10 caracteres')
    .max(500, 'A descrição deve ter no máximo 500 caracteres'),
  stockQuantity: z
    .number()
    .int('A quantidade deve ser um número inteiro')
    .min(0, 'A quantidade não pode ser negativa'),
  price: z
    .number()
    .min(0, 'O preço não pode ser negativo')
    .multipleOf(0.01, 'O preço deve ter no máximo 2 casas decimais'),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
});

type ProductFormData = z.infer<typeof productSchema>;

const FormProduct: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/product-category');
    return response.data;
  };

  // Buscar categorias
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      await api.post('/products', data);
      toast.success('Produto adicionado com sucesso!');
      reset(); // Limpa o formulário
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Erro ao adicionar produto';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-accent-dark rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Adicionar Novo Produto
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nome do Produto */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Nome do Produto
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Digite o nome do produto"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Descrição */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Descrição
          </label>
          <textarea
            id="description"
            rows={3}
            {...register('description')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Digite a descrição do produto"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quantidade em Estoque */}
          <div>
            <label
              htmlFor="stockQuantity"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Quantidade em Estoque
            </label>
            <input
              type="number"
              id="stockQuantity"
              {...register('stockQuantity', { valueAsNumber: true })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="0"
            />
            {errors.stockQuantity && (
              <p className="mt-1 text-sm text-red-600">
                {errors.stockQuantity.message}
              </p>
            )}
          </div>

          {/* Preço */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Preço
            </label>
            <input
              type="number"
              id="price"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="0"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">
                {errors.price.message}
              </p>
            )}
          </div>
        </div>

        {/* Categoria */}
        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Categoria
          </label>
          <select
            id="categoryId"
            {...register('categoryId')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            disabled={isCategoriesLoading}
          >
            <option value="">Selecione uma categoria</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.categoryId.message}
            </p>
          )}
          {isCategoriesLoading && (
            <p className="mt-1 text-sm text-gray-500">
              Carregando categorias...
            </p>
          )}
        </div>

        {/* Botão Submit */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting || isCategoriesLoading}
            className={`w-full px-4 py-2 text-white font-medium rounded-md shadow-sm
              ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              }`}
          >
            {isSubmitting ? 'Adicionando...' : 'Adicionar Produto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormProduct;
