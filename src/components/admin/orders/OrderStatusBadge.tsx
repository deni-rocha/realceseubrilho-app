import React from 'react';
import {
  FaClock,
  FaSpinner,
  FaShippingFast,
  FaCheckCircle,
  FaTimesCircle,
  FaUndo,
} from 'react-icons/fa';

export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    darkBgColor: string;
    icon: React.ReactNode;
  }
> = {
  PENDING: {
    label: 'Pendente',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    darkBgColor: 'dark:bg-yellow-900/30 dark:text-yellow-400',
    icon: <FaClock />,
  },
  PROCESSING: {
    label: 'Processando',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    darkBgColor: 'dark:bg-blue-900/30 dark:text-blue-400',
    icon: <FaSpinner className="animate-spin" />,
  },
  SHIPPED: {
    label: 'Enviado',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    darkBgColor: 'dark:bg-purple-900/30 dark:text-purple-400',
    icon: <FaShippingFast />,
  },
  DELIVERED: {
    label: 'Entregue',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    darkBgColor: 'dark:bg-green-900/30 dark:text-green-400',
    icon: <FaCheckCircle />,
  },
  CANCELLED: {
    label: 'Cancelado',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    darkBgColor: 'dark:bg-red-900/30 dark:text-red-400',
    icon: <FaTimesCircle />,
  },
  REFUNDED: {
    label: 'Reembolsado',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    darkBgColor: 'dark:bg-gray-900/30 dark:text-gray-400',
    icon: <FaUndo />,
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
};

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const config = statusConfig[status];

  if (!config) {
    return null;
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${config.color} ${config.bgColor} ${config.darkBgColor}
        ${sizeClasses[size]}
      `}
    >
      {showIcon && <span className="flex-shrink-0">{config.icon}</span>}
      <span>{config.label}</span>
    </span>
  );
};

export default OrderStatusBadge;
