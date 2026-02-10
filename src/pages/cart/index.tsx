import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { createGuestOrder } from '../../api/orders';
import type { GuestCheckoutData, CartItem } from '../../types/catalog';
import { useMutation } from '@tanstack/react-query';
import CartContent from '../../components/home/CartContent';
import GuestCheckoutModal from '../../components/home/GuestCheckoutModal';
import Toast from '../../components/home/Toast';

const CartPage: React.FC = () => {
  const navigate = useNavigate();

  // Hooks
  const {
    cartItems,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
    toast,
    setToast,
  } = useCart();

  // State
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Mutations
  const createOrderMutation = useMutation({
    mutationFn: async (data: GuestCheckoutData) => {
      return await createGuestOrder(
        data.guestName,
        data.guestWhatsapp,
        cartItems,
      );
    },
    onSuccess: (data) => {
      clearCart();
      setIsCheckoutModalOpen(false);
      window.location.href = data.whatsappUrl;
    },
    onError: (error: any) => {
      console.error('Erro ao criar pedido:', error);
      alert(
        error.response?.data?.message ||
          'Erro ao criar pedido. Tente novamente.',
      );
    },
  });

  // Handlers
  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleCheckout = useCallback(() => {
    if (cartItems.length === 0) return;
    setIsCheckoutModalOpen(true);
  }, [cartItems]);

  const handleConfirmCheckout = useCallback(
    (data: GuestCheckoutData) => {
      createOrderMutation.mutate(data);
    },
    [createOrderMutation],
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfdfd]">
      <Header onGoBack={handleGoBack} />

      <MainContent
        cartItems={cartItems}
        cartTotal={cartTotal}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
        isCheckoutDisabled={cartItems.length === 0}
      />

      <GuestCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onConfirm={handleConfirmCheckout}
        isLoading={createOrderMutation.isPending}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

// Subcomponentes para melhor organização
const Header: React.FC<{ onGoBack: () => void }> = ({ onGoBack }) => (
  <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-10">
    <div className="flex items-center justify-between">
      <button
        onClick={onGoBack}
        className="border-2 border-gray-300 rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
        aria-label="Voltar"
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 448 512"
          className="h-5 w-5"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"></path>
        </svg>
      </button>
      <h1 className="text-2xl font-semibold">Meu Carrinho</h1>
      <div className="w-12"></div>
    </div>
  </header>
);

const MainContent: React.FC<{
  cartItems: CartItem[];
  cartTotal: number;
  onUpdateQuantity: (itemId: string, change: number) => void;
  onRemove: (itemId: string) => void;
  onCheckout: () => void;
  isCheckoutDisabled: boolean;
}> = ({
  cartItems,
  cartTotal,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  isCheckoutDisabled,
}) => (
  <main className="flex-1 flex flex-col px-6 py-6">
    <CartContent
      cartItems={cartItems}
      cartTotal={cartTotal}
      onUpdateQuantity={onUpdateQuantity}
      onRemove={onRemove}
      onCheckout={onCheckout}
      isCheckoutDisabled={isCheckoutDisabled}
    />
  </main>
);

export default CartPage;
