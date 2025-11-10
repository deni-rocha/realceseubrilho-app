import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';

interface FloatingCartButtonProps {
  cartItemsCount: number;
  onClick: () => void;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({
  cartItemsCount,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="xl:hidden fixed bottom-6 right-6 bg-[#415444] text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-[#415444]/90 transition-colors z-40"
      aria-label="Abrir carrinho"
    >
      <FaShoppingCart className="h-6 w-6" />
      {cartItemsCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
          {cartItemsCount}
        </span>
      )}
    </button>
  );
};

export default FloatingCartButton;
