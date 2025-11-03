import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../../api';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { FaImage, FaTimes, FaPlus } from 'react-icons/fa';
import type { ResponseCreateProduct } from '../../types/createProduct.ts/ResponseCreateProduct';

// Interface para categoria
interface Category {
  id: string;
  name: string;
}

// Interface para imagens
interface ImageFile {
  file: File;
  preview: string;
  id: string;
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

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const FormProduct: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
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
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newImages: ImageFile[] = [];
    const remainingSlots = MAX_IMAGES - selectedImages.length;

    if (files.length > remainingSlots) {
      toast.warning(
        `Você pode adicionar no máximo ${remainingSlots} imagem(ns) a mais`,
      );
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    for (const file of filesToProcess) {
      // Validar tamanho do arquivo
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`A imagem "${file.name}" excede o tamanho máximo de 5MB`);
        continue;
      }

      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error(`O arquivo "${file.name}" não é uma imagem válida`);
        continue;
      }

      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageFile: ImageFile = {
          file,
          preview: reader.result as string,
          id: `${Date.now()}-${Math.random()}`,
        };

        setSelectedImages((prev) => {
          // Verificar se não excede o limite
          if (prev.length >= MAX_IMAGES) {
            return prev;
          }
          return [...prev, imageFile];
        });
      };
      reader.readAsDataURL(file);
    }

    // Limpar o input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (id: string) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const removeAllImages = () => {
    setSelectedImages([]);
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

      // Se tiver imagens selecionadas, fazer o upload de todas
      if (selectedImages.length > 0 && productResponse.data.id) {
        const uploadPromises = selectedImages.map(async (imageFile, index) => {
          const formData = new FormData();
          formData.append('file', imageFile.file);

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
          } catch (error) {
            console.error(`Erro ao enviar imagem ${index + 1}:`, error);
            throw error;
          }
        });

        try {
          await Promise.all(uploadPromises);
          toast.success(
            `Produto e ${selectedImages.length} imagem(ns) adicionados com sucesso!`,
          );
        } catch (imageError: any) {
          toast.warning(
            'Produto criado, mas houve erro ao enviar algumas imagens',
          );
          console.error('Erro ao enviar imagens:', imageError);
        }
      } else {
        toast.success('Produto adicionado com sucesso!');
      }

      reset();
      removeAllImages();
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white hidden md:block">
        Adicionar Novo Produto
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Campo de Upload de Múltiplas Imagens */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="images"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Imagens do Produto
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedImages.length}/{MAX_IMAGES} imagens
            </span>
          </div>

          {/* Grid de Imagens */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {/* Imagens Selecionadas */}
            {selectedImages.map((imageFile) => (
              <div key={imageFile.id} className="relative group">
                <img
                  src={imageFile.preview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={() => removeImage(imageFile.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                  title="Remover imagem"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
                {/* Indicador de imagem principal (primeira imagem) */}
                {selectedImages[0].id === imageFile.id && (
                  <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    Principal
                  </div>
                )}
              </div>
            ))}

            {/* Botão para Adicionar Mais Imagens */}
            {selectedImages.length < MAX_IMAGES && (
              <div
                className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <FaPlus className="w-6 h-6 text-gray-400 mb-1" />
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">
                  Adicionar
                </p>
              </div>
            )}
          </div>

          {/* Input File Oculto */}
          <input
            type="file"
            id="images"
            ref={fileInputRef}
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
          />

          {/* Informações e Botão de Limpar */}
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG até 5MB cada • Máximo de {MAX_IMAGES} imagens
            </p>
            {selectedImages.length > 0 && (
              <button
                type="button"
                onClick={removeAllImages}
                className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
              >
                Remover todas
              </button>
            )}
          </div>

          {/* Dica sobre imagem principal */}
          {selectedImages.length > 0 && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                💡 <strong>Dica:</strong> A primeira imagem será usada como
                imagem principal do produto.
              </p>
            </div>
          )}
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
