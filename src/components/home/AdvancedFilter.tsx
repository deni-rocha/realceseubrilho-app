import React, { useState, useEffect } from 'react';
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './AdvancedFilter.css';

export interface FilterOptions {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  sortBy: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'newest';
  inStock: boolean;
}

interface AdvancedFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  priceRange: { min: number; max: number };
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  sortBy: FilterOptions['sortBy'];
  onSortChange: (sort: FilterOptions['sortBy']) => void;
  inStockOnly: boolean;
  onInStockChange: (inStock: boolean) => void;
  onClearFilters: () => void;
  productCount: number;
  maxPrice?: number;
  isOpen?: boolean; // Add isOpen prop to expose state
  onOpenChange?: (isOpen: boolean) => void; // Add callback for state changes
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  categories,
  selectedCategories,
  onCategoriesChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  inStockOnly,
  onInStockChange,
  onClearFilters,
  productCount,
  maxPrice = 1000,
  isOpen, // Accept isOpen prop
  onOpenChange, // Accept onOpenChange callback
}) => {
  // Use controlled or uncontrolled state based on props
  const isControlled = isOpen !== undefined;
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);

  // Determine which state to use
  const effectiveIsOpen = isControlled ? isOpen : uncontrolledIsOpen;

  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    sort: true,
    stock: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const handleSelectAllCategories = () => {
    if (selectedCategories.length === categories.length) {
      onCategoriesChange([]);
    } else {
      onCategoriesChange([...categories]);
    }
  };

  const activeFiltersCount =
    selectedCategories.length +
    (priceRange.min > 0 || priceRange.max < maxPrice ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (sortBy !== 'newest' ? 1 : 0);

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (effectiveIsOpen) {
      document.body.classList.add('filter-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('filter-open');
      document.body.style.overflow = '';
    }

    return () => {
      document.body.classList.remove('filter-open');
      document.body.style.overflow = '';
    };
  }, [effectiveIsOpen]);

  // Handle internal state changes
  const handleSetIsOpen = (newIsOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledIsOpen(newIsOpen);
    }
    if (onOpenChange) {
      onOpenChange(newIsOpen);
    }
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => handleSetIsOpen(!effectiveIsOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-[#e0e5ce] border-2 border-[#415444] rounded-full shadow-md hover:bg-[#d1d8c5] transition-all duration-300"
        >
          <div className="flex items-center gap-2">
            <FaFilter className="text-[#415444]" />
            <span className="font-medium text-gray-700">Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-1 text-xs font-semibold text-white bg-[#415444] rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <span className="text-sm font-semibold text-gray-600">
            {productCount} produtos
          </span>
        </button>
      </div>

      {/* Mobile Overlay */}
      {effectiveIsOpen && (
        <div
          className="filter-overlay lg:hidden"
          onClick={() => handleSetIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Desktop Filter Sidebar / Mobile Modal */}
      <div
        className={`
        filter-panel-mobile lg:relative
        ${effectiveIsOpen ? 'open' : 'closed'}
      `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-title"
      >
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between z-30">
          <div className="flex items-center gap-2">
            <FaFilter className="text-[#415444]" />
            <h3 id="filter-title" className="text-lg font-semibold">
              Filtros
            </h3>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-1 text-xs font-semibold text-white bg-[#415444] rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <button
            onClick={() => handleSetIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 filter-button"
            aria-label="Fechar filtros"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-4 lg:p-0 space-y-6 filter-content">
          {/* Results Count - Desktop */}
          <div className="hidden lg:block mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Filtros
            </h3>
            <span className="text-sm text-gray-600">
              {productCount} produtos
            </span>
          </div>

          {/* Clear Filters Button */}
          {activeFiltersCount > 0 && (
            <button
              onClick={onClearFilters}
              className="w-full px-4 py-2 text-sm font-medium text-[#415444] bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Limpar Filtros ({activeFiltersCount})
            </button>
          )}

          {/* Categories Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('categories')}
              className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
              <span className="font-semibold text-gray-800">Categorias</span>
              {expandedSections.categories ? (
                <FaChevronUp className="text-gray-600" />
              ) : (
                <FaChevronDown className="text-gray-600" />
              )}
            </button>

            {expandedSections.categories && (
              <div className="p-4 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedCategories.length === categories.length}
                    onChange={handleSelectAllCategories}
                    className="w-4 h-4 text-[#415444] border-gray-300 rounded focus:ring-[#415444]"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Todas as Categorias
                  </span>
                </label>
                <div className="h-px bg-gray-200 my-2" />
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="w-4 h-4 text-[#415444] border-gray-300 rounded focus:ring-[#415444]"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Range Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('price')}
              className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
              <span className="font-semibold text-gray-800">
                Faixa de Preço
              </span>
              {expandedSections.price ? (
                <FaChevronUp className="text-gray-600" />
              ) : (
                <FaChevronDown className="text-gray-600" />
              )}
            </button>

            {expandedSections.price && (
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm text-gray-700">
                    Preço Mínimo: R$ {priceRange.min.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    step="10"
                    value={priceRange.min}
                    onChange={(e) =>
                      onPriceRangeChange({
                        ...priceRange,
                        min: Number(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#415444]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-gray-700">
                    Preço Máximo: R$ {priceRange.max.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    step="10"
                    value={priceRange.max}
                    onChange={(e) =>
                      onPriceRangeChange({
                        ...priceRange,
                        max: Number(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#415444]"
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                  <span>R$ {priceRange.min.toFixed(2)}</span>
                  <span>-</span>
                  <span>R$ {priceRange.max.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Sort Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('sort')}
              className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
              <span className="font-semibold text-gray-800">Ordenar Por</span>
              {expandedSections.sort ? (
                <FaChevronUp className="text-gray-600" />
              ) : (
                <FaChevronDown className="text-gray-600" />
              )}
            </button>

            {expandedSections.sort && (
              <div className="p-4 space-y-2">
                {[
                  { value: 'newest', label: 'Mais Recentes' },
                  { value: 'name-asc', label: 'Nome (A-Z)' },
                  { value: 'name-desc', label: 'Nome (Z-A)' },
                  { value: 'price-asc', label: 'Menor Preço' },
                  { value: 'price-desc', label: 'Maior Preço' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <input
                      type="radio"
                      name="sortBy"
                      value={option.value}
                      checked={sortBy === option.value}
                      onChange={() =>
                        onSortChange(option.value as FilterOptions['sortBy'])
                      }
                      className="w-4 h-4 text-[#415444] border-gray-300 focus:ring-[#415444]"
                    />
                    <span className="text-sm text-gray-700">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Stock Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection('stock')}
              className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
              <span className="font-semibold text-gray-800">
                Disponibilidade
              </span>
              {expandedSections.stock ? (
                <FaChevronUp className="text-gray-600" />
              ) : (
                <FaChevronDown className="text-gray-600" />
              )}
            </button>

            {expandedSections.stock && (
              <div className="p-4">
                <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => onInStockChange(e.target.checked)}
                    className="w-4 h-4 text-[#415444] border-gray-300 rounded focus:ring-[#415444]"
                  />
                  <span className="text-sm text-gray-700">
                    Apenas em Estoque
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="filter-mobile-footer lg:hidden">
          <button
            onClick={() => handleSetIsOpen(false)}
            className="w-full px-4 py-3 bg-[#415444] text-white font-semibold rounded-lg hover:bg-[#338838] transition-colors filter-button"
            aria-label={`Ver ${productCount} produtos`}
          >
            Ver {productCount} Produtos
          </button>
        </div>
      </div>
    </>
  );
};

export default AdvancedFilter;
