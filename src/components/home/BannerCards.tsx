import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
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
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Buscar produto em destaque
  const { data: featuredProducts, isLoading: isLoadingFeatured } = useQuery({
    queryKey: ['featuredProduct'],
    queryFn: async () => {
      const response = await publicApi.get<IBannerProduct[]>(
        '/products/public/featured',
      );
      return response.data;
    },
  });

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

  const featuredProduct = featuredProducts?.[0];
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
  };

  const handleProductClick = (productId: string) => {
    navigate(`/produto/${productId}`);
  };

  // Skeleton Loading para o card de destaque
  const FeaturedSkeleton = () => (
    <div className="bg-[#e0e5ce] border-0 rounded-[24px] p-6 animate-pulse">
      <div className="h-4 w-32 bg-[#338838]/30 rounded mb-2"></div>
      <div className="h-8 w-3/4 bg-gray-400/30 rounded mb-4"></div>
      <div className="h-4 w-full bg-gray-400/20 rounded mb-2"></div>
      <div className="h-4 w-2/3 bg-gray-400/20 rounded mb-6"></div>
      <div className="h-10 w-28 bg-[#415444]/50 rounded-lg"></div>
    </div>
  );

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

  return (
    <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Banner Produto em Destaque */}
      {isLoadingFeatured ? (
        <FeaturedSkeleton />
      ) : featuredProduct ? (
        <div
          className="bg-[#e0e5ce] border-0 rounded-[24px] p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group relative overflow-hidden"
          onClick={() => handleProductClick(featuredProduct.id)}
        >
          {/* Imagem de fundo sutil */}
          {featuredProduct.imageUrls?.[0] && (
            <div
              className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
              style={{
                backgroundImage: `url(${featuredProduct.imageUrls[0]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium uppercase text-[#338838]">
                ⭐ EM DESTAQUE
              </span>
              {featuredProduct.category && (
                <span className="text-xs bg-[#338838]/20 text-[#338838] px-2 py-0.5 rounded-full">
                  {featuredProduct.category.name}
                </span>
              )}
            </div>

            <h3 className="mb-2 text-2xl font-semibold text-gray-800 line-clamp-2 group-hover:text-[#338838] transition-colors">
              {featuredProduct.name}
            </h3>

            <p className="mb-4 text-gray-600 line-clamp-2 text-sm">
              {featuredProduct.description}
            </p>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-[#338838]">
                R$ {parseFloat(featuredProduct.price).toFixed(2)}
              </span>
            </div>

            <button
              onClick={(e) => handleAddToCart(featuredProduct, e)}
              className="bg-[#415444] hover:bg-[#415444]/90 text-white px-6 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg flex items-center gap-2"
            >
              <FaShoppingCart />
              Adicionar ao Carrinho
            </button>
          </div>

          {/* Imagem do produto no canto */}
          {featuredProduct.imageUrls?.[0] && (
            <div className="absolute -right-4 -bottom-4 w-32 h-32 md:w-40 md:h-40 opacity-30 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none">
              <img
                src={featuredProduct.imageUrls[0]}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      ) : (
        // Fallback quando não há produto em destaque
        <div className="bg-[#e0e5ce] border-0 rounded-[24px] p-6">
          <p className="mb-2 text-sm font-medium uppercase text-[#338838]">
            MELHORES OFERTAS
          </p>
          <h3 className="mb-4 text-2xl font-semibold">
            Coleção de Produtos de Beleza
          </h3>
          <p className="mb-6 text-gray-600">
            Descubra os melhores produtos segundo sua paixão
          </p>
          <button
            onClick={() => navigate('/catalogo')}
            className="bg-[#415444] hover:bg-[#415444]/90 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Ver Mais
          </button>
        </div>
      )}

      {/* Banner Produto em Promoção */}
      {isLoadingSale ? (
        <SaleSkeleton />
      ) : saleProduct && saleProduct.salePrice ? (
        <div
          className="bg-[#e7ddd1] border-0 rounded-[24px] p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group relative overflow-hidden"
          onClick={() => handleProductClick(saleProduct.id)}
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
                  -{calculateDiscount(saleProduct.price, saleProduct.salePrice)}
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

              <button
                onClick={(e) => handleAddToCart(saleProduct, e)}
                className="bg-[#415444] hover:bg-[#415444]/90 text-white px-6 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg flex items-center gap-2"
              >
                <FaShoppingCart />
                Adicionar ao Carrinho
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
            <p className="mb-2 text-gray-600">Em breve novidades incríveis!</p>
            <p className="mb-6 text-2xl font-bold text-gray-800">
              Fique de olho 👀
            </p>
            <button
              onClick={() => navigate('/catalogo')}
              className="bg-[#415444] hover:bg-[#415444]/90 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Ver Catálogo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerCards;
