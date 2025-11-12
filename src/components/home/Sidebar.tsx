import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaUser,
  FaCog,
  FaEnvelope,
  FaShoppingCart,
  FaHeadset,
  FaSignOutAlt,
} from 'react-icons/fa';

interface SidebarProps {
  isAuthenticated: boolean;
  cartItemsCount: number;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isAuthenticated,
  cartItemsCount,
  onLogout,
}) => {
  const location = useLocation();

  // Function to determine if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-64 border-r border-gray-200 px-6 py-8 hidden lg:block">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#415444]">Realce Seu Brilho</h1>
      </div>
      <nav className="space-y-6">
        <Link
          to="/home"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors relative ${
            isActive('/home')
              ? 'bg-[#415444] text-white'
              : 'bg-[#e0e5ce] text-[#415444] hover:bg-[#d0d5be]'
          }`}
        >
          {isActive('/home') && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
          )}
          <FaHome className="h-5 w-5" />
          Catálogo
        </Link>
        {isAuthenticated && (
          <>
            <Link
              to="/customer"
              className={`flex items-center gap-3 px-3 py-2 transition-colors relative ${
                isActive('/customer')
                  ? 'text-[#415444] font-semibold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {isActive('/customer') && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#415444] rounded-r-full" />
              )}
              <FaUser className="h-5 w-5" />
              Perfil
            </Link>
            <button
              type="button"
              className="flex items-center gap-3 px-3 py-2 text-gray-500 transition-colors hover:text-gray-900 w-full text-left"
            >
              <FaCog className="h-5 w-5" />
              Configurações
            </button>
            <button
              type="button"
              className="flex items-center gap-3 px-3 py-2 text-gray-500 transition-colors hover:text-gray-900 w-full text-left"
            >
              <FaEnvelope className="h-5 w-5" />
              Mensagens
            </button>
          </>
        )}
        <button
          type="button"
          className="flex items-center gap-3 px-3 py-2 text-gray-500 transition-colors hover:text-gray-900 w-full text-left"
        >
          <FaShoppingCart className="h-5 w-5" />
          Meu Carrinho
          {cartItemsCount > 0 && (
            <span className="ml-auto bg-[#338838] text-white text-xs rounded-full px-2 py-0.5">
              {cartItemsCount}
            </span>
          )}
        </button>
        <Link
          to="/support"
          className={`flex items-center gap-3 px-3 py-2 transition-colors relative ${
            isActive('/support')
              ? 'text-[#415444] font-semibold'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {isActive('/support') && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#415444] rounded-r-full" />
          )}
          <FaHeadset className="h-5 w-5" />
          Suporte
        </Link>

        {isAuthenticated && (
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-3 py-2 text-red-500 transition-colors hover:text-red-600 w-full"
          >
            <FaSignOutAlt className="h-5 w-5" />
            Sair
          </button>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;