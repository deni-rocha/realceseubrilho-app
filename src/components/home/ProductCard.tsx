import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaSpinner } from 'react-icons/fa';
import type { IProduct } from '../../types/catalog';

interface ProductCardProps {
  product: IProduct;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onAddToCart: () => void;
  onQuickView?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onAddToCart,
  onQuickView,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const imageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const images =
    product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [];
  const hasMultipleImages = images.length > 1;

  // Reset to first image when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setIsImageLoading(true);

    // Cleanup: clear timeout if component unmounts
    return () => {
      if (imgRef.current) {
        imgRef.current.onload = null;
        imgRef.current.onerror = null;
      }
    };
  }, [product.id]);

  // Show spinner when image index changes
  useEffect(() => {
    setIsImageLoading(true);
  }, [currentImageIndex]);

  // Detect if image is already loaded (for cached images on mobile)
  useLayoutEffect(() => {
    if (!imgRef.current || !images[currentImageIndex]) return;

    const img = imgRef.current;

    const checkImageLoaded = () => {
      // Only consider loaded if complete AND naturalWidth > 0
      if (img.complete && img.naturalWidth > 0) {
        setIsImageLoading(false);
      }
    };

    // Check immediately (after layout)
    requestAnimationFrame(() => {
      checkImageLoaded();
    });

    // Fallback: after 1.2s, assume loaded (prevents infinite spinner)
    const timeoutId = setTimeout(() => {
      setIsImageLoading(false);
    }, 1200);

    // Listen to events
    const handleLoad = () => setIsImageLoading(false);
    const handleError = () => setIsImageLoading(false);
    img.onload = handleLoad;
    img.onerror = handleError;

    return () => {
      clearTimeout(timeoutId);
      img.onload = null;
      img.onerror = null;
    };
  }, [images, currentImageIndex]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && hasMultipleImages) {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1,
      );
    }

    if (isRightSwipe && hasMultipleImages) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1,
      );
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const location = useLocation();

  return (
    <div
      key={`${product.id}-${location.key}`}
      className="group border-0 bg-[#e0e5ce] rounded-[24px] overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="p-0 relative"
        ref={imageRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {isHovered && onQuickView && (
          <>
            <div className="absolute inset-0 bg-black/40 z-10 transition-opacity" />
            <button
              onClick={onQuickView}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transform transition-all bg-white text-black hover:bg-white/90 px-6 py-2 rounded-lg font-medium"
            >
              Visualização Rápida
            </button>
          </>
        )}

        {/* Image */}
        {images.length > 0 ? (
          <div className="relative h-[280px] w-full">
            {/* Spinner de carregamento */}
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-5 transition-opacity duration-300">
                <FaSpinner className="w-8 h-8 text-green-600 animate-spin" />
              </div>
            )}
            <img
              key={currentImageIndex}
              ref={imgRef}
              src={images[currentImageIndex]}
              alt={`${product.name} - Imagem ${currentImageIndex + 1}`}
              className={`h-[280px] w-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105 ${
                isImageLoading ? 'invisible' : 'visible'
              }`}
            />
          </div>
        ) : (
          <div className="h-[280px] w-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">Sem imagem</span>
          </div>
        )}

        {/* Navigation Arrows - Show conditionally based on available navigation */}
        {hasMultipleImages && (
          <>
            {/* Previous arrow - show if not at first image */}
            {currentImageIndex > 0 && (
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all z-30"
                aria-label="Imagem anterior"
              >
                <FaChevronLeft className="h-4 w-4 text-gray-800" />
              </button>
            )}

            {/* Next arrow - show if not at last image */}
            {currentImageIndex < images.length - 1 && (
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all z-30"
                aria-label="Próxima imagem"
              >
                <FaChevronRight className="h-4 w-4 text-gray-800" />
              </button>
            )}
          </>
        )}

        {/* Image Indicators - Only show if multiple images */}
        {hasMultipleImages && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`transition-all ${
                  index === currentImageIndex
                    ? 'w-6 h-2 bg-white'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                } rounded-full`}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h4 className="text-lg font-semibold mb-1 line-clamp-1">
            {product.name}
          </h4>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[#338838] text-xl font-semibold">
            R$ {parseFloat(product.price).toFixed(2)}
          </p>
          <button
            onClick={onAddToCart}
            disabled={product.stockQuantity === 0}
            className={`border border-gray-300 px-4 py-2 rounded-full transition-colors text-sm font-medium ${
              product.stockQuantity === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-[#415444] hover:text-white hover:border-[#415444]'
            }`}
          >
            {product.stockQuantity === 0 ? 'Sem estoque' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
