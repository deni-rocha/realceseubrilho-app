import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface ActiveFilterBadgesProps {
  selectedCategories: string[];
  priceRange: { min: number; max: number };
  sortBy: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'newest';
  inStockOnly: boolean;
  maxPrice: number;
  onRemoveCategory: (category: string) => void;
  onRemovePriceFilter: () => void;
  onRemoveSortFilter: () => void;
  onRemoveStockFilter: () => void;
  onClearAll: () => void;
}

const ActiveFilterBadges: React.FC<ActiveFilterBadgesProps> = ({
  selectedCategories,
  priceRange,
  sortBy,
  inStockOnly,
  maxPrice,
  onRemoveCategory,
  onRemovePriceFilter,
  onRemoveSortFilter,
  onRemoveStockFilter,
  onClearAll,
}) => {
  const hasPriceFilter = priceRange.min > 0 || priceRange.max < maxPrice;
  const hasSortFilter = sortBy !== 'newest';

  const sortLabels = {
    'name-asc': 'Nome (A-Z)',
    'name-desc': 'Nome (Z-A)',
    'price-asc': 'Menor Preço',
    'price-desc': 'Maior Preço',
    'newest': 'Mais Recentes',
  };

  const hasAnyFilter =
    selectedCategories.length > 0 ||
    hasPriceFilter ||
    hasSortFilter ||
    inStockOnly;

  if (!hasAnyFilter) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700">
          Filtros Ativos
        </h4>
        <button
          onClick={onClearAll}
          className="text-xs text-[#338838] hover:text-[#415444] font-medium transition-colors"
        >
          Limpar Todos
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Category Badges */}
        {selectedCategories.map((category) => (
          <span
            key={category}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#415444] text-white text-sm rounded-full hover:bg-[#338838] transition-colors"
          >
            <span>{category}</span>
            <button
              onClick={() => onRemoveCategory(category)}
              className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
              aria-label={`Remover filtro ${category}`}
            >
              <FaTimes size={12} />
            </button>
          </span>
        ))}

        {/* Price Range Badge */}
        {hasPriceFilter && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition-colors">
            <span>
              R$ {priceRange.min.toFixed(2)} - R$ {priceRange.max.toFixed(2)}
            </span>
            <button
              onClick={onRemovePriceFilter}
              className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
              aria-label="Remover filtro de preço"
            >
              <FaTimes size={12} />
            </button>
          </span>
        )}

        {/* Sort Badge */}
        {hasSortFilter && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-full hover:bg-purple-700 transition-colors">
            <span>{sortLabels[sortBy]}</span>
            <button
              onClick={onRemoveSortFilter}
              className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
              aria-label="Remover ordenação"
            >
              <FaTimes size={12} />
            </button>
          </span>
        )}

        {/* Stock Badge */}
        {inStockOnly && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm rounded-full hover:bg-green-700 transition-colors">
            <span>Em Estoque</span>
            <button
              onClick={onRemoveStockFilter}
              className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
              aria-label="Remover filtro de estoque"
            >
              <FaTimes size={12} />
            </button>
          </span>
        )}
      </div>
    </div>
  );
};

export default ActiveFilterBadges;
