import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  FaArrowLeft,
  FaUser,
  FaUserSecret,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCalendar,
  FaBox,
} from 'react-icons/fa';
import api from '../../../api';
import OrderStatusBadge, { type OrderStatus } from './OrderStatusBadge';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    imageUrls?: string[];
  };
}

interface Order {
  id: string;
  orderDate: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  guestName: string | null;
  guestWhatsapp: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

interface OrderDetailsProps {
  orderId: string;
  onBack: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId, onBack }) => {
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const response = await api.get<Order>(`/orders/${orderId}`);
      return response.data;
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Carregando...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          Pedido não encontrado
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-yellow-600 dark:hover:bg-yellow-700 rounded-lg transition-colors"
        >
          <FaArrowLeft />
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <FaArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Detalhes do Pedido
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              #{order.id}
            </p>
          </div>
        </div>
        <OrderStatusBadge status={order.status} size="lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda - Informações Principais */}
        <div className="lg:col-span-2 space-y-6">
          {/* Produtos do Pedido */}
          <div className="bg-white dark:bg-accent-dark rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaBox />
              Produtos ({order.orderItems.length})
            </h3>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  {item.product.imageUrls && item.product.imageUrls[0] ? (
                    <img
                      src={item.product.imageUrls[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                      <FaBox className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Quantidade: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Preço Unit.
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Subtotal
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Total */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Total do Pedido
                </span>
                <span className="text-2xl font-bold text-green-600 dark:text-yellow-500">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Informações de Entrega */}
          <div className="bg-white dark:bg-accent-dark rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaMapMarkerAlt />
              Endereço de Entrega
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {order.shippingAddress}
            </p>
          </div>
        </div>

        {/* Coluna Direita - Informações do Cliente e Pagamento */}
        <div className="space-y-6">
          {/* Informações do Cliente */}
          <div className="bg-white dark:bg-accent-dark rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              {order.user ? <FaUser /> : <FaUserSecret />}
              Cliente
            </h3>
            {order.user ? (
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nome
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.user.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.user.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ID do Usuário
                  </p>
                  <p className="font-mono text-xs text-gray-700 dark:text-gray-300">
                    {order.user.id}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-3">
                  <p className="text-xs text-yellow-800 dark:text-yellow-400">
                    Pedido feito como convidado
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nome
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.guestName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    WhatsApp
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.guestWhatsapp}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Informações de Pagamento */}
          <div className="bg-white dark:bg-accent-dark rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaCreditCard />
              Pagamento
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Método
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {order.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Valor Total
                </p>
                <p className="text-xl font-bold text-green-600 dark:text-yellow-500">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* Informações de Data */}
          <div className="bg-white dark:bg-accent-dark rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaCalendar />
              Datas
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Data do Pedido
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(order.orderDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Criado em
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Última Atualização
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(order.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
