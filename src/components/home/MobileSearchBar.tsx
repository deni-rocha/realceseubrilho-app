import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface MobileSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClose: () => void;
  onClear?: () => void;
}

const MobileSearchBar: React.FC<MobileSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onClose,
  onClear,
}) => {
  const handleClose = () => {
    if (onClear) {
      onClear();
    }
    onClose();
  };

  return (
    <div className="lg:hidden bg-white border-b border-gray-200 p-4 mb-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#338838] focus:border-transparent"
            autoFocus
          />
        </div>
        <button
          onClick={handleClose}
          className="p-3 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center"
          aria-label="Fechar busca"
        >
          <svg
            className="h-5 w-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {searchTerm && (
        <div className="mt-3 text-sm text-gray-600">
          Buscando por: <span className="font-semibold">{searchTerm}</span>
        </div>
      )}
    </div>
  );
};

export default MobileSearchBar;
