import React from 'react';
import {
  FaTimes,
  FaMinus,
  FaPlus,
  FaExclamationTriangle,
} from 'react-icons/fa';
import type { CartItem as CartItemType } from '../../types/catalog';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, change: number) => void;
  onRemove: (itemId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const isAtMaxStock = item.quantity >= item.stockQuantity;

  return (
    <div className="flex gap-4 bg-white rounded-3xl p-4 shadow-sm">
      {item.imageUrls && item.imageUrls.length > 0 ? (
        <img
          src={item.imageUrls[0]}
          alt={item.name}
          className="h-[100px] w-[100px] rounded-2xl bg-[#e0e5ce] object-cover flex-shrink-0"
        />
      ) : (
        <div className="h-[100px] w-[100px] rounded-2xl bg-gray-300 flex items-center justify-center flex-shrink-0">
          <span className="text-gray-500 text-xs">Sem imagem</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-2">
            <h4 className="font-semibold text-sm line-clamp-2">{item.name}</h4>
            <p className="text-sm text-[#338838] mt-1">
              {item.categories && item.categories.length > 0
                ? item.categories.map((cat) => cat.name).join(', ')
                : 'Sem categoria'}
            </p>
            <p className="font-semibold mt-2">
              R$ {parseFloat(item.price).toFixed(2)}
            </p>
            {isAtMaxStock && (
              <div className="flex items-center gap-1 mt-1 text-xs text-yellow-600">
                <FaExclamationTriangle className="h-3 w-3" />
                <span>Estoque máximo</span>
              </div>
            )}
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="h-8 w-8 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
            aria-label={`Remover ${item.name}`}
          >
            <FaTimes className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-4 bg-[#f7f7f7] rounded-full px-4 py-1">
            <button
              className="text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => onUpdateQuantity(item.id, -1)}
              aria-label={`Diminuir quantidade de ${item.name}`}
            >
              <FaMinus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <button
              className={`transition-colors ${
                isAtMaxStock
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => onUpdateQuantity(item.id, 1)}
              disabled={isAtMaxStock}
              aria-label={`Aumentar quantidade de ${item.name}`}
            >
              <FaPlus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
