import { useQuery } from '@tanstack/react-query';
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaSpinner,
  FaDollarSign,
  FaChartLine,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { fetchDashboardSummary } from '../../api/statistics';

// Componente de Card de Estatística
const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  loading,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  loading?: boolean;
  subtitle?: string;
}) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        {loading ? (
          <FaSpinner className="animate-spin text-2xl mt-2 text-gray-400" />
        ) : (
          <>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="text-2xl text-white" />
      </div>
    </div>
  </div>
);

// Componente de Card de Métrica Financeira
const FinancialMetricCard = ({
  title,
  value,
  percentage,
  loading,
  positive = true,
}: {
  title: string;
  value: number;
  percentage?: number;
  loading?: boolean;
  positive?: boolean;
}) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
      {title}
    </h4>
    {loading ? (
      <FaSpinner className="animate-spin text-2xl text-gray-400" />
    ) : (
      <>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </p>
        {percentage !== undefined && (
          <p
            className={`text-sm mt-2 ${
              positive
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {percentage.toFixed(2)}% de margem
          </p>
        )}
      </>
    )}
  </div>
);

const Dashboard = () => {
  // Buscar dados do dashboard
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: fetchDashboardSummary,
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  });

  // Formatador de moeda
  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

  return (
    <div className="mt-8 space-y-8">
      <div>
        <h2 className="hidden md:block text-3xl font-semibold text-gray-900 mb-2 dark:text-white">
          Dashboard Financeiro
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Visão geral das métricas e estatísticas do sistema
        </p>
      </div>

      {/* Cards de Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Usuários"
          value={dashboard?.totalUsers || 0}
          icon={FaUsers}
          color="bg-blue-500"
          loading={isLoading}
        />
        <StatCard
          title="Total de Produtos"
          value={dashboard?.totalProducts || 0}
          icon={FaBox}
          color="bg-green-500"
          loading={isLoading}
          subtitle={`${dashboard?.outOfStockProducts || 0} sem estoque`}
        />
        <StatCard
          title="Total de Pedidos"
          value={dashboard?.totalOrders || 0}
          icon={FaShoppingCart}
          color="bg-orange-500"
          loading={isLoading}
          subtitle={`${dashboard?.pendingOrders || 0} pendentes`}
        />
        <StatCard
          title="Receita Total"
          value={formatCurrency(dashboard?.totalRevenue || 0)}
          icon={FaDollarSign}
          color="bg-purple-500"
          loading={isLoading}
        />
      </div>

      {/* Métricas Financeiras */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <FaChartLine className="text-blue-500" />
          Análise Financeira
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FinancialMetricCard
            title="Receita Total"
            value={dashboard?.totalRevenue || 0}
            loading={isLoading}
          />
          <FinancialMetricCard
            title="Custo dos Produtos"
            value={dashboard?.totalCost || 0}
            loading={isLoading}
          />
          <FinancialMetricCard
            title="Lucro Bruto"
            value={dashboard?.grossProfit || 0}
            percentage={
              dashboard?.totalRevenue
                ? (dashboard.grossProfit / dashboard.totalRevenue) * 100
                : 0
            }
            loading={isLoading}
            positive={true}
          />
          <FinancialMetricCard
            title="Lucro Líquido"
            value={dashboard?.netProfit || 0}
            percentage={
              dashboard?.totalRevenue
                ? (dashboard.netProfit / dashboard.totalRevenue) * 100
                : 0
            }
            loading={isLoading}
            positive={(dashboard?.netProfit || 0) >= 0}
          />
        </div>
      </div>

      {/* Resumo de Despesas */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Despesas Operacionais
        </h3>
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <FaSpinner className="animate-spin text-4xl text-gray-400" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total de Despesas
              </span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(dashboard?.totalExpenses || 0)}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 mb-1">Receita</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(dashboard?.totalRevenue || 0)}
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  Lucro Bruto
                </p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(dashboard?.grossProfit || 0)}
                </p>
              </div>
              <div
                className={`p-4 rounded-lg ${
                  (dashboard?.netProfit || 0) >= 0
                    ? 'bg-purple-50 dark:bg-purple-900/20'
                    : 'bg-red-50 dark:bg-red-900/20'
                }`}
              >
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  Lucro Líquido
                </p>
                <p
                  className={`text-xl font-bold ${
                    (dashboard?.netProfit || 0) >= 0
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {formatCurrency(dashboard?.netProfit || 0)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status dos Pedidos e Estoque */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status dos Pedidos */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Status dos Pedidos
          </h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <FaSpinner className="animate-spin text-4xl text-gray-400" />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pendentes
                </span>
                <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                  {dashboard?.pendingOrders || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Em Processamento
                </span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {dashboard?.processingOrders || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enviados
                </span>
                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                  {dashboard?.shippedOrders || 0}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Status do Estoque */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FaExclamationTriangle className="text-orange-500" />
            Alertas de Estoque
          </h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <FaSpinner className="animate-spin text-4xl text-gray-400" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-300">
                      Produtos sem Estoque
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      Requer ação imediata
                    </p>
                  </div>
                  <span className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {dashboard?.outOfStockProducts || 0}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                      Produtos com Estoque Baixo
                    </p>
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                      Abaixo de 10 unidades
                    </p>
                  </div>
                  <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {dashboard?.lowStockProducts || 0}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">
                      Total de Produtos
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Cadastrados no sistema
                    </p>
                  </div>
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {dashboard?.totalProducts || 0}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resumo Rápido */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
        <h3 className="text-xl font-semibold mb-4">Resumo Rápido</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
            <p className="text-sm opacity-90 mb-1">Margem Bruta</p>
            <p className="text-2xl font-bold">
              {dashboard?.totalRevenue
                ? (
                    ((dashboard.grossProfit || 0) / dashboard.totalRevenue) *
                    100
                  ).toFixed(2)
                : 0}
              %
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
            <p className="text-sm opacity-90 mb-1">Margem Líquida</p>
            <p className="text-2xl font-bold">
              {dashboard?.totalRevenue
                ? (
                    ((dashboard.netProfit || 0) / dashboard.totalRevenue) *
                    100
                  ).toFixed(2)
                : 0}
              %
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
            <p className="text-sm opacity-90 mb-1">Ticket Médio</p>
            <p className="text-2xl font-bold">
              {dashboard?.totalOrders
                ? formatCurrency(
                    (dashboard.totalRevenue || 0) / dashboard.totalOrders,
                  )
                : formatCurrency(0)}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
            <p className="text-sm opacity-90 mb-1">Total de Usuários</p>
            <p className="text-2xl font-bold">{dashboard?.totalUsers || 0}</p>
          </div>
        </div>
      </div>

      {/* Mensagem de atualização */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Dashboard atualizado automaticamente a cada 30 segundos
      </div>
    </div>
  );
};

export default Dashboard;
