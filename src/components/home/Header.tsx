import React from 'react';
import { FaSearch, FaBell } from 'react-icons/fa';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  userName = 'Cliente',
}) => {
  return (
    <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">
          Olá, {userName}! <span className="ml-1">👋</span>
        </h2>
        <p className="text-gray-500">Bem-vindo a nossa loja</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative flex-1 md:flex-none">
          <FaSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#338838]"
          />
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <FaBell className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;
