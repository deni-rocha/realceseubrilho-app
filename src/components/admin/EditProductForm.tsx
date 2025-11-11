import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { IoMdClose } from 'react-icons/io';
import api from '../../api';
import type { ResponseCreateProduct } from '../../types/createProduct.ts/ResponseCreateProduct';

interface Category {
  id: string;
  name: string;
}

interface Product extends ResponseCreateProduct {}

// Interface para os dados do formulário
interface ProductFormData {
  name?: string;
  description?: string;
  stockQuantity?: number;
  price?: string;
  categoryIds?: string[];
}

interface EditProductFormProps {
  productId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface ImagePreview {
  id: string;
  url: string;
  file?: File;
  isNew: boolean;
}

const EditProductForm: React.FC<EditProductFormProps> = ({
  productId,
  onSuccess,
  onCancel,
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ProductFormData>({});
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);

  // Buscar dados do produto
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await api.get<Product>(`/products/${productId}`);
      return response.data;
    },
  });

  // Buscar categorias
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get<Category[]>('/product-category');
      return response.data;
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const response = await api.patch(`/products/${productId}`, data);
      return response.data;
    },
    onSuccess: async () => {
      try {
        for (const imageUrl of imagesToRemove) {
          try {
            await api.delete(`/products/${productId}/image`, {
              params: { imageUrl },
            });
          } catch (error) {
            console.error('Erro ao remover imagem:', error);
            toast.warning('Algumas imagens não puderam ser removidas');
          }
        }

        const newImages = images.filter((img) => img.isNew && img.file);

        if (newImages.length === 1) {
          const imageFormData = new FormData();
          imageFormData.append('file', newImages[0].file!);

          await api.post(`/products/${productId}/image`, imageFormData);
        } else if (newImages.length > 1) {
          const imagesFormData = new FormData();
          newImages.forEach((image) => {
            imagesFormData.append('files', image.file!);
          });

          await api.post(`/products/${productId}/images`, imagesFormData);
        }

        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['product', productId] });
        toast.success('Produto atualizado com sucesso!');
        onSuccess?.();
      } catch (error: any) {
        console.error('Erro no processo de atualização:', error);
        toast.error(
          error.response?.data?.message ||
            'Erro ao processar imagens. Produto foi atualizado, mas pode haver problemas com as imagens.',
        );
      }
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar produto:', error);
      toast.error(error.response?.data?.message || 'Erro ao atualizar produto');
    },
  });

  // Carregar dados do produto no formulário
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        stockQuantity: product.stockQuantity,
        price: product.price,
        categoryIds: product.categories?.map((cat) => cat.id) || [],
      });

      // Carregar imagens existentes
      if (product.imageUrls && product.imageUrls.length > 0) {
        const existingImages: ImagePreview[] = product.imageUrls.map(
          (url, index) => ({
            id: `existing-${index}`,
            url,
            isNew: false,
          }),
        );
        setImages(existingImages);
      }
    }
  }, [product]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'stockQuantity' ? Number(value) : value,
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => {
      const currentCategories = prev.categoryIds || [];
      const isSelected = currentCategories.includes(categoryId);

      return {
        ...prev,
        categoryIds: isSelected
          ? currentCategories.filter((id) => id !== categoryId)
          : [...currentCategories, categoryId],
      };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImagePreviews: ImagePreview[] = [];

    Array.from(files).forEach((file) => {
      // Validar tipo de arquivo
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
        toast.error(`Formato não suportado: ${file.name}`);
        return;
      }
      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`Imagem muito grande: ${file.name}. Máximo 5MB`);
        return;
      }

      const preview: ImagePreview = {
        id: `new-${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file),
        file,
        isNew: true,
      };
      newImagePreviews.push(preview);
    });

    setImages((prev) => [...prev, ...newImagePreviews]);
    // Limpar o input para permitir adicionar o mesmo arquivo novamente
    e.target.value = '';
  };

  const handleRemoveImage = (imageId: string) => {
    const imageToRemove = images.find((img) => img.id === imageId);
    if (!imageToRemove) return;

    // Se é uma imagem existente (não nova), adiciona à lista de remoção
    if (!imageToRemove.isNew) {
      setImagesToRemove((prev) => [...prev, imageToRemove.url]);
    }

    // Remove da lista de imagens
    setImages((prev) => prev.filter((img) => img.id !== imageId));

    // Liberar memória do URL.createObjectURL se for imagem nova
    if (imageToRemove.isNew && imageToRemove.url) {
      URL.revokeObjectURL(imageToRemove.url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar se há pelo menos uma imagem
    if (images.length === 0) {
      toast.error('Adicione pelo menos uma imagem ao produto');
      return;
    }

    // Enviar apenas os campos esperados pelo backend
    updateProductMutation.mutate(formData);
  };

  if (isLoadingProduct) {
    return (
      <div className="text-gray-700 dark:text-gray-300">Carregando...</div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Nome do Produto
        </label>
        <input
          type="text"
          name="name"
          value={formData.name || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Descrição
        </label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleInputChange}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Preço
          </label>
          <input
            type="number"
            name="price"
            value={formData.price || ''}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Quantidade em Estoque
          </label>
          <input
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity || ''}
            onChange={handleInputChange}
            min="0"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
          Categorias
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-3">
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={formData.categoryIds?.includes(category.id) || false}
                  onChange={() => handleCategoryToggle(category.id)}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
                />
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  {category.name}
                </span>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nenhuma categoria disponível
            </p>
          )}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 block">
          Selecione uma ou mais categorias para o produto
        </span>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Imagens do Produto
        </label>

        {/* Grid de imagens */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.url}
                  alt="Preview"
                  className="h-32 w-full object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
                />
                {/* Badge para indicar imagem nova */}
                {image.isNew && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    Nova
                  </span>
                )}
                {/* Botão de remover */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Remover imagem"
                >
                  <IoMdClose size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input para adicionar novas imagens */}
        <div className="mt-2">
          <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-green-500 dark:hover:border-green-500 transition-colors">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Clique para adicionar imagens ou arraste e solte
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                PNG, JPG, GIF até 5MB
              </p>
            </div>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              multiple
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
          disabled={updateProductMutation.isPending}
        >
          {updateProductMutation.isPending
            ? 'Salvando...'
            : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  );
};

export default EditProductForm;
