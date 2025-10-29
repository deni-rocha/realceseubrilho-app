import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { FaUsers, FaBox, FaShoppingCart, FaSpinner } from 'react-icons/fa';
import { useMemo } from 'react';

// Tipos
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role: {
    id: string;
    name: string;
  };
}

interface Product {
  id: string;
  name: string;
  description: string;
  stockQuantity: number;
  price: number;
  category: {
    id: string;
    name: string;
  };
}

interface Order {
  id: string;
  userId: string;
  status: string;
  total: number;
  createdAt: string;
}

// Componente de Card de Estatística
const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  loading,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  loading?: boolean;
}) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        {loading ? (
          <FaSpinner className="animate-spin text-2xl mt-2 text-gray-400" />
        ) : (
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="text-2xl text-white" />
      </div>
    </div>
  </div>
);

// Componente de Gráfico de Barras
const BarChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-24 truncate">
            {item.label}
          </span>
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            >
              <span className="text-xs font-semibold text-white">
                {item.value}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente de Gráfico de Pizza
const PieChart = ({
  data,
}: {
  data: { label: string; value: number; color: string }[];
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const slices = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    // Cálculo de coordenadas do arco SVG
    const x1 = 50 + 45 * Math.cos((Math.PI * startAngle) / 180);
    const y1 = 50 + 45 * Math.sin((Math.PI * startAngle) / 180);
    const x2 = 50 + 45 * Math.cos((Math.PI * currentAngle) / 180);
    const y2 = 50 + 45 * Math.sin((Math.PI * currentAngle) / 180);
    const largeArc = angle > 180 ? 1 : 0;

    return {
      ...item,
      path: `M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z`,
      percentage: percentage.toFixed(1),
    };
  });

  return (
    <div className="flex flex-col lg:flex-row items-center gap-6">
      <svg viewBox="0 0 100 100" className="w-48 h-48">
        {slices.map((slice, index) => (
          <path
            key={index}
            d={slice.path}
            fill={slice.color}
            className="hover:opacity-80 transition-opacity cursor-pointer"
          />
        ))}
      </svg>
      <div className="space-y-2">
        {slices.map((slice, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {slice.label}: {slice.value} ({slice.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de Gráfico de Linha
const LineChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 300;
    const y = 150 - (item.value / maxValue) * 130;
    return { x, y, ...item };
  });

  const pathData = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <div className="w-full">
      <svg viewBox="0 0 300 180" className="w-full h-48">
        {/* Grade */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1="0"
            y1={20 + i * 32.5}
            x2="300"
            y2={20 + i * 32.5}
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />
        ))}

        {/* Linha do gráfico */}
        <path
          d={pathData}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          className="drop-shadow"
        />

        {/* Área preenchida */}
        <path
          d={`${pathData} L ${points[points.length - 1].x} 150 L 0 150 Z`}
          fill="url(#gradient)"
          opacity="0.3"
        />

        {/* Pontos */}
        {points.map((point, index) => (
          <g key={index}>
            <circle cx={point.x} cy={point.y} r="4" fill="#3b82f6" />
            <text
              x={point.x}
              y="170"
              textAnchor="middle"
              fontSize="10"
              fill="#6b7280"
            >
              {point.label}
            </text>
          </g>
        ))}

        {/* Gradiente */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

const Dashboard = () => {
  // Buscar dados dos usuários
  const { data: users, isLoading: loadingUsers } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get<User[]>('/users');
      return response.data;
    },
  });

  // Buscar dados dos produtos
  const { data: products, isLoading: loadingProducts } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get<Product[]>('/products');
      return response.data;
    },
  });

  // Buscar dados dos pedidos
  const { data: orders, isLoading: loadingOrders } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await api.get<Order[]>('/orders');
      return response.data;
    },
  });

  // Calcular estatísticas
  const stats = useMemo(() => {
    const totalRevenue =
      orders?.reduce((sum, order) => sum + order.total, 0) || 0;

    return {
      totalUsers: users?.length || 0,
      totalProducts: products?.length || 0,
      totalOrders: orders?.length || 0,
      totalRevenue: totalRevenue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
    };
  }, [users, products, orders]);

  // Dados para gráfico de usuários por papel
  const usersByRole = useMemo(() => {
    if (!users) return [];

    const roleCount: Record<string, number> = {};
    users.forEach((user) => {
      const roleName = user.role.name;
      roleCount[roleName] = (roleCount[roleName] || 0) + 1;
    });

    return Object.entries(roleCount).map(([label, value]) => ({
      label,
      value,
    }));
  }, [users]);

  // Dados para gráfico de produtos por categoria
  const productsByCategory = useMemo(() => {
    if (!products) return [];

    const categoryCount: Record<string, number> = {};
    products.forEach((product) => {
      const categoryName = product.category.name;
      categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
    });

    const colors = [
      '#3b82f6',
      '#10b981',
      '#f59e0b',
      '#ef4444',
      '#8b5cf6',
      '#ec4899',
    ];

    return Object.entries(categoryCount).map(([label, value], index) => ({
      label,
      value,
      color: colors[index % colors.length],
    }));
  }, [products]);

  // Dados para gráfico de pedidos recentes
  const recentOrders = useMemo(() => {
    if (!orders) return [];

    // Agrupar pedidos por data (últimos 7 dias)
    const ordersByDate: Record<string, number> = {};

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const dateKey = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      });
      ordersByDate[dateKey] = (ordersByDate[dateKey] || 0) + 1;
    });

    // Pegar os últimos 7 registros
    return Object.entries(ordersByDate)
      .slice(-7)
      .map(([label, value]) => ({ label, value }));
  }, [orders]);

  const isLoading = loadingUsers || loadingProducts || loadingOrders;

  return (
    <div className="mt-8 space-y-8">
      <div>
        <h2 className="hidden md:block text-3xl font-semibold text-gray-900 mb-2 dark:text-white">
          Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Visão geral das métricas e estatísticas do sistema
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Usuários"
          value={stats.totalUsers}
          icon={FaUsers}
          color="bg-blue-500"
          loading={loadingUsers}
        />
        <StatCard
          title="Total de Produtos"
          value={stats.totalProducts}
          icon={FaBox}
          color="bg-green-500"
          loading={loadingProducts}
        />
        <StatCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          icon={FaShoppingCart}
          color="bg-orange-500"
          loading={loadingOrders}
        />
        <StatCard
          title="Receita Total"
          value={stats.totalRevenue}
          icon={FaShoppingCart}
          color="bg-purple-500"
          loading={loadingOrders}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Usuários por Papel */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Usuários por Função
          </h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <FaSpinner className="animate-spin text-4xl text-gray-400" />
            </div>
          ) : usersByRole.length > 0 ? (
            <BarChart data={usersByRole} />
          ) : (
            <p className="text-gray-500 text-center py-8">
              Nenhum dado disponível
            </p>
          )}
        </div>

        {/* Gráfico de Produtos por Categoria */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Produtos por Categoria
          </h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <FaSpinner className="animate-spin text-4xl text-gray-400" />
            </div>
          ) : productsByCategory.length > 0 ? (
            <PieChart data={productsByCategory} />
          ) : (
            <p className="text-gray-500 text-center py-8">
              Nenhum dado disponível
            </p>
          )}
        </div>

        {/* Gráfico de Pedidos Recentes */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Pedidos Recentes
          </h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <FaSpinner className="animate-spin text-4xl text-gray-400" />
            </div>
          ) : recentOrders.length > 0 ? (
            <LineChart data={recentOrders} />
          ) : (
            <p className="text-gray-500 text-center py-8">
              Nenhum dado disponível
            </p>
          )}
        </div>
      </div>

      {/* Tabela de Produtos com Baixo Estoque */}
      {products && products.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Produtos com Baixo Estoque
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Produto</th>
                  <th className="px-6 py-3">Categoria</th>
                  <th className="px-6 py-3">Estoque</th>
                  <th className="px-6 py-3">Preço</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter((product) => product.stockQuantity < 10)
                  .slice(0, 5)
                  .map((product) => (
                    <tr
                      key={product.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {product.category.name}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            product.stockQuantity === 0
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {product.price.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {products.filter((product) => product.stockQuantity < 10).length ===
              0 && (
              <p className="text-gray-500 text-center py-8">
                Todos os produtos têm estoque adequado
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
