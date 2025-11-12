import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import CartContent from './CartContent';
import type { CartItem } from '../../types/catalog';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  cartTotal: number;
  onUpdateQuantity: (itemId: string, change: number) => void;
  onRemove: (itemId: string) => void;
  onCheckout: () => void;
  isCheckoutDisabled?: boolean;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  cartTotal,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  isCheckoutDisabled = false,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 300); // Duração da animação
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!shouldRender) return null;

  return (
    <div className="xl:hidden fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#fcfdfd] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isClosing ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-8 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold">Meu Carrinho</h3>
            <button
              onClick={handleClose}
              className="border-2 border-gray-300 rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Fechar carrinho"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col">
          <CartContent
            cartItems={cartItems}
            cartTotal={cartTotal}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
            onCheckout={onCheckout}
            isCheckoutDisabled={isCheckoutDisabled}
          />
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
