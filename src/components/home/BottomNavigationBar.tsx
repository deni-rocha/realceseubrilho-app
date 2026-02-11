import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';

interface BottomNavigationBarProps {
  activeTab: 'home' | 'search' | 'cart' | 'profile';
  cartItemsCount: number;
  onTabChange: (tab: 'home' | 'search' | 'cart' | 'profile') => void;
  onClearSearch?: () => void; // New prop to clear search
  isHidden?: boolean; // New prop to control visibility
}

const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  activeTab,
  cartItemsCount,
  onTabChange,
  onClearSearch,
  isHidden = false, // Default to false (visible)
}) => {
  const navigate = useNavigate();

  // Handle home tab click with search clearing
  const handleHomeClick = () => {
    onTabChange('home');
    if (onClearSearch) {
      onClearSearch();
    }
  };

  // Handle search tab click - navigate to search page
  const handleSearchClick = () => {
    onTabChange('search');
    navigate('/search');
  };

  // Handle profile tab click - navigate to profile page
  const handleProfileClick = () => {
    onTabChange('profile');
    navigate('/profile');
  };

  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 transition-transform duration-300 ease-in-out ${isHidden ? 'translate-y-full' : 'translate-y-0'}`}
    >
      <div className="flex items-center justify-around h-16">
        {/* Home */}
        <button
          onClick={handleHomeClick}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
            activeTab === 'home'
              ? 'text-[#415444]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          aria-label="Início"
        >
          {activeTab === 'home' && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#415444] rounded-b-full" />
          )}
          <FaHome className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">Início</span>
        </button>

        {/* Search */}
        <button
          onClick={handleSearchClick}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
            activeTab === 'search'
              ? 'text-[#415444]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          aria-label="Buscar"
        >
          {activeTab === 'search' && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#415444] rounded-b-full" />
          )}
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
          {activeTab === 'cart' && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#415444] rounded-b-full" />
          )}
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
          onClick={handleProfileClick}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
            activeTab === 'profile'
              ? 'text-[#415444]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          aria-label="Perfil"
        >
          {activeTab === 'profile' && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#415444] rounded-b-full" />
          )}
          <FaUser className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">Perfil</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigationBar;
