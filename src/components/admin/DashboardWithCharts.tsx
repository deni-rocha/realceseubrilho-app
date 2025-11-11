import { useQuery } from '@tanstack/react-query';
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaDollarSign,
  FaChartLine,
  FaSpinner,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa';
import {
  fetchDashboardSummary,
  fetchMonthlyRevenue,
} from '../../api/statistics';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useMemo } from 'react';

// Cores
const COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
};

const PIE_COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#06b6d4',
];

// Tooltip customizado
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}:{' '}
            {typeof entry.value === 'number' && entry.name.includes('R$')
              ? entry.value.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Card de Estatística com animação
const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  loading,
  subtitle,
  trend,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  loading?: boolean;
  subtitle?: string;
  trend?: { value: number; isPositive: boolean };
}) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          {title}
        </p>
        {loading ? (
          <FaSpinner className="animate-spin text-2xl mt-2 text-gray-400" />
        ) : (
          <>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
            {trend && (
              <div
                className={`flex items-center gap-1 mt-2 text-sm ${
                  trend.isPositive
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {trend.isPositive ? <FaArrowUp /> : <FaArrowDown />}
                <span>{Math.abs(trend.value).toFixed(1)}%</span>
              </div>
            )}
          </>
        )}
      </div>
      <div className={`p-4 rounded-full ${color} bg-opacity-10`}>
        <Icon className={`text-2xl ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  </div>
);

const DashboardWithCharts = () => {
  const currentYear = new Date().getFullYear();

  // Buscar dados do dashboard
  const { data: dashboard, isLoading: loadingDashboard } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: fetchDashboardSummary,
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  });

  // Buscar receita mensal
  const { data: monthlyRevenue, isLoading: loadingMonthly } = useQuery({
    queryKey: ['monthly-revenue', currentYear],
    queryFn: () => fetchMonthlyRevenue(currentYear),
  });

  const isLoading = loadingDashboard || loadingMonthly;

  // Preparar dados dos gráficos
  const monthlyData = useMemo(() => {
    if (!monthlyRevenue) return [];
    const months = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];
    return monthlyRevenue.map((item) => ({
      mes: months[item.month - 1],
      receita: item.revenue,
      custo: item.cost,
      lucro: item.profit,
      pedidos: item.orders,
    }));
  }, [monthlyRevenue]);

  // Dados do gráfico de pizza (status dos pedidos)
  const orderStatusData = useMemo(() => {
    if (!dashboard) return [];
    return [
      { name: 'Pendentes', value: dashboard.pendingOrders },
      { name: 'Processando', value: dashboard.processingOrders },
      { name: 'Enviados', value: dashboard.shippedOrders },
    ].filter((item) => item.value > 0);
  }, [dashboard]);

  // Dados do gráfico de estoque
  const stockData = useMemo(() => {
    if (!dashboard) return [];
    return [
      {
        name: 'OK',
        value: Math.max(
          0,
          dashboard.totalProducts -
            dashboard.lowStockProducts -
            dashboard.outOfStockProducts,
        ),
      },
      { name: 'Baixo', value: dashboard.lowStockProducts },
      { name: 'Zerado', value: dashboard.outOfStockProducts },
    ].filter((item) => item.value > 0);
  }, [dashboard]);

  // Formatador de moeda
  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

  return (
    <div className="mt-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="hidden md:block text-3xl font-semibold text-gray-900 mb-2 dark:text-white">
          Dashboard Financeiro
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Visão geral com gráficos em tempo real • Atualização automática a cada
          30s
        </p>
      </div>

      {/* Cards de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Receita Total"
          value={formatCurrency(dashboard?.totalRevenue || 0)}
          icon={FaDollarSign}
          color="bg-blue-500"
          loading={isLoading}
          subtitle={`${dashboard?.totalOrders || 0} pedidos`}
        />
        <StatCard
          title="Lucro Bruto"
          value={formatCurrency(dashboard?.grossProfit || 0)}
          icon={FaChartLine}
          color="bg-green-500"
          loading={isLoading}
          subtitle={`Margem: ${dashboard?.totalRevenue ? ((dashboard.grossProfit / dashboard.totalRevenue) * 100).toFixed(1) : 0}%`}
        />
        <StatCard
          title="Lucro Líquido"
          value={formatCurrency(dashboard?.netProfit || 0)}
          icon={FaChartLine}
          color={
            (dashboard?.netProfit || 0) >= 0 ? 'bg-purple-500' : 'bg-red-500'
          }
          loading={isLoading}
          subtitle={`Margem: ${dashboard?.totalRevenue ? ((dashboard.netProfit / dashboard.totalRevenue) * 100).toFixed(1) : 0}%`}
        />
        <StatCard
          title="Despesas"
          value={formatCurrency(dashboard?.totalExpenses || 0)}
          icon={FaExclamationTriangle}
          color="bg-orange-500"
          loading={isLoading}
          subtitle="Operacionais"
        />
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Área - Receita Mensal */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FaChartLine className="text-blue-500" />
            Evolução da Receita ({currentYear})
          </h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <FaSpinner className="animate-spin text-4xl text-gray-400" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={COLORS.primary}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLORS.primary}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={COLORS.success}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLORS.success}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-gray-700"
                />
                <XAxis
                  dataKey="mes"
                  className="text-xs text-gray-600 dark:text-gray-400"
                />
                <YAxis className="text-xs text-gray-600 dark:text-gray-400" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="receita"
                  stroke={COLORS.primary}
                  fillOpacity={1}
                  fill="url(#colorReceita)"
                  name="Receita (R$)"
                />
                <Area
                  type="monotone"
                  dataKey="lucro"
                  stroke={COLORS.success}
                  fillOpacity={1}
                  fill="url(#colorLucro)"
                  name="Lucro (R$)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Gráfico de Barras - Pedidos por Mês */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FaShoppingCart className="text-purple-500" />
            Pedidos por Mês
          </h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <FaSpinner className="animate-spin text-4xl text-gray-400" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-gray-700"
                />
                <XAxis
                  dataKey="mes"
                  className="text-xs text-gray-600 dark:text-gray-400"
                />
                <YAxis className="text-xs text-gray-600 dark:text-gray-400" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="pedidos"
                  fill={COLORS.secondary}
                  name="Pedidos"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Gráficos de Pizza */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status dos Pedidos */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Status dos Pedidos
          </h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <FaSpinner className="animate-spin text-4xl text-gray-400" />
            </div>
          ) : orderStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) =>
                    `${props.name}: ${((props.percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-12">
              Nenhum pedido ativo
            </p>
          )}
        </div>

        {/* Status do Estoque */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Status do Estoque
          </h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <FaSpinner className="animate-spin text-4xl text-gray-400" />
            </div>
          ) : stockData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stockData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) =>
                    `${props.name}: ${((props.percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill={COLORS.success} />
                  <Cell fill={COLORS.warning} />
                  <Cell fill={COLORS.danger} />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-12">
              Nenhum produto cadastrado
            </p>
          )}
        </div>
      </div>

      {/* Cards Informativos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white shadow-lg">
          <FaUsers className="text-3xl mb-2 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Total de Usuários</p>
          <p className="text-3xl font-bold">{dashboard?.totalUsers || 0}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white shadow-lg">
          <FaBox className="text-3xl mb-2 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Total de Produtos</p>
          <p className="text-3xl font-bold">{dashboard?.totalProducts || 0}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg text-white shadow-lg">
          <FaExclamationTriangle className="text-3xl mb-2 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Estoque Baixo</p>
          <p className="text-3xl font-bold">
            {dashboard?.lowStockProducts || 0}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-lg text-white shadow-lg">
          <FaExclamationTriangle className="text-3xl mb-2 opacity-80" />
          <p className="text-sm opacity-90 mb-1">Sem Estoque</p>
          <p className="text-3xl font-bold">
            {dashboard?.outOfStockProducts || 0}
          </p>
        </div>
      </div>

      {/* Resumo Financeiro Detalhado */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-6 rounded-lg shadow-lg text-white">
        <h3 className="text-xl font-semibold mb-4">Resumo Financeiro Geral</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
            <p className="text-sm opacity-90 mb-1">Receita Total</p>
            <p className="text-2xl font-bold">
              {formatCurrency(dashboard?.totalRevenue || 0)}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
            <p className="text-sm opacity-90 mb-1">Custo Total</p>
            <p className="text-2xl font-bold">
              {formatCurrency(dashboard?.totalCost || 0)}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
            <p className="text-sm opacity-90 mb-1">Despesas</p>
            <p className="text-2xl font-bold">
              {formatCurrency(dashboard?.totalExpenses || 0)}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
            <p className="text-sm opacity-90 mb-1">Lucro Bruto</p>
            <p className="text-2xl font-bold">
              {formatCurrency(dashboard?.grossProfit || 0)}
            </p>
            <p className="text-xs mt-1">
              {dashboard?.totalRevenue
                ? `${((dashboard.grossProfit / dashboard.totalRevenue) * 100).toFixed(1)}% margem`
                : '0% margem'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
            <p className="text-sm opacity-90 mb-1">Lucro Líquido</p>
            <p className="text-2xl font-bold">
              {formatCurrency(dashboard?.netProfit || 0)}
            </p>
            <p className="text-xs mt-1">
              {dashboard?.totalRevenue
                ? `${((dashboard.netProfit / dashboard.totalRevenue) * 100).toFixed(1)}% margem`
                : '0% margem'}
            </p>
          </div>
        </div>
      </div>

      {/* Rodapé com última atualização */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Dashboard atualizado automaticamente a cada 30 segundos
      </div>
    </div>
  );
};

export default DashboardWithCharts;
