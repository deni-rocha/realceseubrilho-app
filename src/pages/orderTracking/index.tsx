import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/index';
import type { Order } from '../../types/Order';
import { useAuthStore } from '../../store/authStore';
import OrderStatusBadge from '../../components/admin/orders/OrderStatusBadge';
import { FaSpinner, FaHome } from 'react-icons/fa';

const capitalizeName = (name: string) => {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const OrderTrackingPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const { user } = useAuthStore();

  // Buscar detalhes do pedido
  const { data: order, isLoading: isOrderLoading } = useQuery<Order, Error>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) throw new Error('Order ID is required');
      const response = await api.get<Order>(`/orders/${orderId}`);
      return response.data;
    },
    enabled: !!orderId,
  });

  // Buscar histórico de pedidos do usuário
  const { data: orderHistory, isLoading: isHistoryLoading } = useQuery<
    Order[],
    Error
  >({
    queryKey: ['orderHistory', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await api.get<Order[]>(`/orders/user/${user.id}`);
      return response.data;
    },
    enabled: !!user?.id,
  });

  if (isOrderLoading || isHistoryLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fcfdfd]">
        <div className="flex flex-col items-center">
          <FaSpinner className="w-8 h-8 text-green-600 animate-spin mb-2" />
          <span className="text-xl text-gray-700">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
        >
          <FaHome className="w-5 h-5 mr-2" />
          Início
        </button>
      </div>

      {orderId && order ? (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Acompanhar Pedido
              </h2>
              <p className="text-gray-600">
                Data:{' '}
                {order.orderDate
                  ? new Date(order.orderDate).toLocaleDateString('pt-BR')
                  : 'Data inválida'}
              </p>
              <p className="text-gray-800 font-medium mt-2">
                {capitalizeName(
                  order.user?.name || order.guestName || 'Cliente',
                )}
              </p>
              {order.guestWhatsapp && (
                <p className="text-gray-600 text-sm">
                  WhatsApp: {order.guestWhatsapp}
                </p>
              )}
              {order.user?.whatsapp && (
                <p className="text-gray-600 text-sm">
                  WhatsApp: {order.user.whatsapp}
                </p>
              )}
            </div>
            <OrderStatusBadge
              status={
                order.status === 'CONFIRMED'
                  ? 'PROCESSING'
                  : (order.status as any)
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Itens do Pedido
              </h3>
              <div className="space-y-4">
                {order.orderItems && order.orderItems.length > 0 ? (
                  order.orderItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-4 border-b pb-4 ${
                        index === order.orderItems.length - 1
                          ? 'border-b-0 pb-0'
                          : ''
                      }`}
                    >
                      {/* Imagem do Produto */}
                      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        {item.product.imageUrls && item.product.imageUrls[0] ? (
                          <img
                            src={item.product.imageUrls[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Informações do Produto */}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Quantidade: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Nenhum item no pedido</p>
                )}
              </div>
            </div>

            <div>
              <div className="space-y-3">
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold text-gray-800">Total</span>
                  <span className="font-bold text-lg text-[#338838]">
                    R${' '}
                    {order.totalAmount.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Informações de Entrega
                </h4>
                <p className="text-gray-600">{order.shippingAddress}</p>
                <p className="text-gray-600 mt-2">
                  Método de pagamento: {order.paymentMethod}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Histórico de Pedidos
          </h2>
          <p className="text-gray-600 mb-6">
            Selecione um pedido para ver os detalhes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orderHistory && orderHistory.length > 0 ? (
              orderHistory.map((orderItem) => (
                <div
                  key={orderItem.id}
                  className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                  onClick={() => navigate(`/orders/${orderItem.id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">
                      Pedido #{orderItem.id.slice(0, 8)}...
                    </h3>
                    <OrderStatusBadge
                      status={
                        orderItem.status === 'CONFIRMED'
                          ? 'PROCESSING'
                          : (orderItem.status as any)
                      }
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {new Date(orderItem.orderDate).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    R${' '}
                    {orderItem.totalAmount.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">
                  {user
                    ? 'Você ainda não fez nenhum pedido.'
                    : 'Faça login para ver seu histórico de pedidos'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;
