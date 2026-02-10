import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import CartItem from './CartItem';
import type { CartItem as CartItemType } from '../../types/catalog';

interface CartContentProps {
  cartItems: CartItemType[];
  cartTotal: number;
  onUpdateQuantity: (itemId: string, change: number) => void;
  onRemove: (itemId: string) => void;
  onCheckout: () => void;
  isCheckoutDisabled?: boolean;
}

const CartContent: React.FC<CartContentProps> = ({
  cartItems,
  cartTotal,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  isCheckoutDisabled = false,
}) => {
  if (cartItems.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center text-gray-500">
          <FaShoppingCart className="mx-auto h-16 w-16 mb-4 text-gray-300" />
          <p>Seu carrinho está vazio</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="space-y-6 flex-grow overflow-auto pb-32">
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </div>

      <div className="mt-8 space-y-4 border-t pt-6 bg-white z-10 fixed bottom-0 left-0 right-0 max-w-md mx-auto w-full px-6 py-4 sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:top-auto">
        <div className="flex items-center justify-between text-lg font-semibold">
          <p>Total</p>
          <p>R$ {cartTotal.toFixed(2)}</p>
        </div>
        <button
          onClick={onCheckout}
          disabled={isCheckoutDisabled}
          className={`w-full bg-[#415444] hover:bg-[#415444]/90 text-white rounded-2xl h-14 text-lg font-semibold mt-4 transition-colors ${
            isCheckoutDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Finalizar Compra
        </button>
      </div>
    </div>
  );
};

export default CartContent;
