import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../../api';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { FaImage, FaTimes } from 'react-icons/fa';
import type { ResponseCreateProduct } from '../../types/createProduct.ts/ResponseCreateProduct';

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
  image: z.any().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

const FormProduct: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('O arquivo deve ser uma imagem');
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);

      // Primeiro, criar o produto
      const productResponse = await api.post<ResponseCreateProduct>(
        '/products',
        {
          name: data.name,
          description: data.description,
          stockQuantity: data.stockQuantity,
          price: data.price,
          categoryId: data.categoryId,
        },
      );

      // Se tiver imagem selecionada, fazer o upload
      if (selectedImage && productResponse.data.id) {
        const formData = new FormData();
        formData.append('file', selectedImage);

        try {
          await api.post(
            `/products/${productResponse.data.id}/image`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          );
          toast.success('Produto e imagem adicionados com sucesso!');
        } catch (imageError: any) {
          toast.error('Produto criado, mas houve um erro ao enviar a imagem');
          console.error('Erro ao enviar imagem:', imageError);
        }
      } else {
        toast.success('Produto adicionado com sucesso!');
      }

      reset();
      removeImage();
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
        {/* Campo de Upload de Imagem */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
          >
            Imagem do Produto
          </label>
          <div className="flex flex-col items-center space-y-4">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-64 h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                className="w-64 h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <FaImage className="w-12 h-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Clique para adicionar uma imagem
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  PNG, JPG até 5MB
                </p>
              </div>
            )}
            <input
              type="file"
              id="image"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

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
                isSubmitting || isCategoriesLoading
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
