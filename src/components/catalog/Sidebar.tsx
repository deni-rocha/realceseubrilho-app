import React from 'react';
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
  return (
    <aside className="w-64 border-r border-gray-200 px-6 py-8 hidden lg:block">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#415444]">Realce Seu Brilho</h1>
      </div>
      <nav className="space-y-6">
        <a
          href="/catalog"
          className="flex items-center gap-3 rounded-lg bg-[#e0e5ce] px-3 py-2 text-[#415444] transition-colors"
        >
          <FaHome className="h-5 w-5" />
          Catálogo
        </a>
        {isAuthenticated && (
          <>
            <a
              href="/customer"
              className="flex items-center gap-3 px-3 py-2 text-gray-500 transition-colors hover:text-gray-900"
            >
              <FaUser className="h-5 w-5" />
              Perfil
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-gray-500 transition-colors hover:text-gray-900"
            >
              <FaCog className="h-5 w-5" />
              Configurações
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 text-gray-500 transition-colors hover:text-gray-900"
            >
              <FaEnvelope className="h-5 w-5" />
              Mensagens
            </a>
          </>
        )}
        <a
          href="#cart"
          className="flex items-center gap-3 px-3 py-2 text-gray-500 transition-colors hover:text-gray-900"
        >
          <FaShoppingCart className="h-5 w-5" />
          Meu Carrinho
          {cartItemsCount > 0 && (
            <span className="ml-auto bg-[#338838] text-white text-xs rounded-full px-2 py-0.5">
              {cartItemsCount}
            </span>
          )}
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 text-gray-500 transition-colors hover:text-gray-900"
        >
          <FaHeadset className="h-5 w-5" />
          Suporte
        </a>
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
