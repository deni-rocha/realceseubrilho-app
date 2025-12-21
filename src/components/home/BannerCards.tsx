import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  FaShoppingCart,
  FaSearch,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import publicApi from '../../api/publicApi';
import { useCart } from '../../hooks/useCart';
import type { IProduct } from '../../types/catalog';

interface IProductCategory {
  id: string;
  name: string;
  description: string | null;
}

interface IBannerProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  cost?: string;
  stockQuantity: number;
  imageUrls: string[];
  category: IProductCategory;
  categories?: IProductCategory[];
  isFeatured?: boolean;
  isOnSale?: boolean;
  salePrice?: string;
}

const BannerCards: React.FC = () => {
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Buscar produto em promoção
  const { data: saleProducts, isLoading: isLoadingSale } = useQuery({
    queryKey: ['saleProduct'],
    queryFn: async () => {
      const response = await publicApi.get<IBannerProduct[]>(
        '/products/public/on-sale',
      );
      return response.data;
    },
  });

  const saleProduct = saleProducts?.[0];

  // Calcular desconto percentual
  const calculateDiscount = (price: string, salePrice: string) => {
    const originalPrice = parseFloat(price);
    const discountedPrice = parseFloat(salePrice);
    if (originalPrice > 0 && discountedPrice > 0) {
      return Math.round(
        ((originalPrice - discountedPrice) / originalPrice) * 100,
      );
    }
    return 0;
  };

  // Converter IBannerProduct para IProduct para o carrinho
  const convertToCartProduct = (product: IBannerProduct): IProduct => {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price:
        product.isOnSale && product.salePrice
          ? product.salePrice
          : product.price,
      cost: product.cost,
      stockQuantity: product.stockQuantity,
      imageUrls: product.imageUrls,
      categories:
        product.categories || (product.category ? [product.category] : []),
      isFeatured: product.isFeatured,
      isOnSale: product.isOnSale,
      salePrice: product.salePrice,
    };
  };

  const handleAddToCart = (product: IBannerProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    const cartProduct = convertToCartProduct(product);
    addToCart(cartProduct);
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setCurrentImageIndex(0);
    setIsModalOpen(true);
  };

  const handleCloseModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saleProduct?.imageUrls) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? saleProduct.imageUrls.length - 1 : prev - 1,
      );
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saleProduct?.imageUrls) {
      setCurrentImageIndex((prev) =>
        prev === saleProduct.imageUrls.length - 1 ? 0 : prev + 1,
      );
    }
  };

  // Skeleton Loading para o card de promoção
  const SaleSkeleton = () => (
    <div className="bg-[#e7ddd1] border-0 rounded-[24px] p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-8 w-40 bg-gray-400/30 rounded mb-4"></div>
          <div className="h-12 w-32 bg-gray-400/40 rounded mb-6"></div>
          <div className="h-10 w-36 bg-[#415444]/50 rounded-lg"></div>
        </div>
        <div className="hidden md:block w-32 h-32 bg-gray-400/30 rounded-xl"></div>
      </div>
    </div>
  );

  // Modal compacto de visualização do produto
  const ProductModal = () => {
    if (!saleProduct) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={handleCloseModal}
      >
        <div
          className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header com botão fechar */}
          <div className="flex items-center justify-between p-3 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
              {saleProduct.name}
            </h2>
            <button
              onClick={handleCloseModal}
              className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
            >
              <FaTimes className="text-gray-500 text-sm" />
            </button>
          </div>

          {/* Imagem do Produto */}
          <div className="relative bg-gray-100">
            {saleProduct.imageUrls && saleProduct.imageUrls.length > 0 ? (
              <>
                <div className="h-64 flex items-center justify-center">
                  <img
                    src={saleProduct.imageUrls[currentImageIndex]}
                    alt={saleProduct.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* Navegação de imagens */}
                {saleProduct.imageUrls.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow transition-all"
                    >
                      <FaChevronLeft className="text-gray-700 text-sm" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow transition-all"
                    >
                      <FaChevronRight className="text-gray-700 text-sm" />
                    </button>

                    {/* Indicadores */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {saleProduct.imageUrls.map((_, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(index);
                          }}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            index === currentImageIndex
                              ? 'bg-[#415444] w-3'
                              : 'bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <span className="text-gray-400">Sem imagem</span>
              </div>
            )}
          </div>

          {/* Preço e Botão */}
          <div className="p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {saleProduct.salePrice && (
                  <span className="text-gray-400 line-through text-sm">
                    R$ {parseFloat(saleProduct.price).toFixed(2)}
                  </span>
                )}
                <span className="text-xl font-bold text-red-600">
                  R${' '}
                  {parseFloat(
                    saleProduct.salePrice || saleProduct.price,
                  ).toFixed(2)}
                </span>
              </div>
              {saleProduct.salePrice && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{calculateDiscount(saleProduct.price, saleProduct.salePrice)}
                  %
                </span>
              )}
            </div>

            <button
              onClick={(e) => handleAddToCart(saleProduct, e)}
              className="w-full bg-[#415444] hover:bg-[#415444]/90 text-white py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 font-medium"
            >
              <FaShoppingCart />
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mb-12">
        {/* Banner Produto em Promoção */}
        {isLoadingSale ? (
          <SaleSkeleton />
        ) : saleProduct && saleProduct.salePrice ? (
          <div
            className="bg-[#e7ddd1] border-0 rounded-[24px] p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.01] group relative overflow-hidden"
            onClick={handleOpenModal}
          >
            {/* Badge de promoção animado */}
            <div className="absolute top-4 right-4 z-20">
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                🔥 PROMOÇÃO
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 relative z-10">
                <h3 className="mb-2 text-xl md:text-2xl font-semibold text-gray-800 line-clamp-2 pr-20 group-hover:text-red-600 transition-colors">
                  {saleProduct.name}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-gray-500 line-through text-lg">
                    R$ {parseFloat(saleProduct.price).toFixed(2)}
                  </span>
                  <span className="bg-red-500 text-white text-sm font-bold px-2 py-0.5 rounded">
                    -
                    {calculateDiscount(
                      saleProduct.price,
                      saleProduct.salePrice,
                    )}
                    %
                  </span>
                </div>

                <p className="mb-4 text-4xl md:text-5xl font-bold text-red-600">
                  R$ {parseFloat(saleProduct.salePrice).toFixed(2)}
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded-full">
                    💰 Economize R${' '}
                    {(
                      parseFloat(saleProduct.price) -
                      parseFloat(saleProduct.salePrice)
                    ).toFixed(2)}
                  </span>
                </div>

                <button className="bg-[#415444] hover:bg-[#415444]/90 text-white px-6 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg flex items-center gap-2">
                  <FaSearch />
                  Ver Produto
                </button>
              </div>

              {/* Imagem do produto */}
              {saleProduct.imageUrls?.[0] && (
                <div className="hidden md:block relative">
                  <div className="w-36 h-36 lg:w-44 lg:h-44 rounded-2xl overflow-hidden shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={saleProduct.imageUrls[0]}
                      alt={saleProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Efeito de brilho */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              )}
            </div>
          </div>
        ) : (
          // Fallback quando não há produto em promoção
          <div className="bg-[#e7ddd1] border-0 rounded-[24px] p-6 flex items-center justify-between">
            <div>
              <h3 className="mb-4 text-3xl font-semibold">Promoção ✨</h3>
              <p className="mb-2 text-gray-600">
                Em breve novidades incríveis!
              </p>
              <p className="text-2xl font-bold text-gray-800">
                Fique de olho 👀
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && saleProduct && <ProductModal />}
    </>
  );
};

export default BannerCards;
