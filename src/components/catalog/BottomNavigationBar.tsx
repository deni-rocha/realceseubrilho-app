import React from 'react';
import { FaHome, FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';

interface BottomNavigationBarProps {
  activeTab: 'home' | 'search' | 'cart' | 'profile';
  cartItemsCount: number;
  onTabChange: (tab: 'home' | 'search' | 'cart' | 'profile') => void;
}

const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  activeTab,
  cartItemsCount,
  onTabChange,
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="flex items-center justify-around h-16">
        {/* Home */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'home'
              ? 'text-[#415444]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          aria-label="Início"
        >
          <FaHome className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">Início</span>
        </button>

        {/* Search */}
        <button
          onClick={() => onTabChange('search')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'search'
              ? 'text-[#415444]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          aria-label="Buscar"
        >
          <FaSearch className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">Buscar</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => onTabChange('cart')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
            activeTab === 'cart'
              ? 'text-[#415444]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          aria-label="Carrinho"
        >
          <div className="relative">
            <FaShoppingCart className="h-6 w-6 mb-1" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartItemsCount > 9 ? '9+' : cartItemsCount}
              </span>
            )}
          </div>
          <span className="text-xs font-medium">Carrinho</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'profile'
              ? 'text-[#415444]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          aria-label="Perfil"
        >
          <FaUser className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">Perfil</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigationBar;
