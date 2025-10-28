import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../../api';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const categorySchema = z.object({
  name: z
    .string()
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .max(50, 'O nome deve ter no máximo 50 caracteres'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const FormCategory: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true);
      await api.post('/product-category', data);
      toast.success('Categoria adicionada com sucesso!');
      reset();
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Erro ao adicionar categoria';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-accent-dark rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white hidden md:block">
        Adicionar Nova Categoria
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nome da Categoria */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Nome da Categoria
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Digite o nome da categoria"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Botão Submit */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-4 py-2 text-white font-medium rounded-md shadow-sm
              ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              }`}
          >
            {isSubmitting ? 'Adicionando...' : 'Adicionar Categoria'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormCategory;
