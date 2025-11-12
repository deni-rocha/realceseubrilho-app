import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  FaChartLine,
  FaSpinner,
  FaCalendar,
  FaTrophy,
  FaChartPie,
} from 'react-icons/fa';
import {
  fetchFinancialStatistics,
  fetchProductProfitability,
  fetchMonthlyRevenue,
  type FinancialStatistics,
  type ProductProfitability,
  type MonthlyRevenue,
} from '../../api/statistics';

// Componente de Card de Métrica
const MetricCard = ({
  title,
  value,
  subtitle,
  color = 'blue',
}: {
  title: string;
  value: string;
  subtitle?: string;
  color?: string;
}) => {
  const colorClasses = {
    blue: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
    green: 'border-green-500 bg-green-50 dark:bg-green-900/20',
    purple: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
    red: 'border-red-500 bg-red-50 dark:bg-red-900/20',
    orange: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20',
  };

  return (
    <div
      className={`p-6 rounded-lg border-l-4 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}
    >
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
        {title}
      </h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
};

// Componente de Gráfico de Barras Horizontal
const HorizontalBarChart = ({
  data,
  title,
}: {
  data: { label: string; value: number }[];
  title: string;
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        {title}
      </h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
              <span className="text-gray-600 dark:text-gray-400 font-semibold">
                {item.value.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de Gráfico de Linha (Receita Mensal)
const MonthlyRevenueChart = ({ data }: { data: MonthlyRevenue[] }) => {
  const maxValue = Math.max(...data.map((d) => d.revenue), 1);
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

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Receita Mensal
      </h3>
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <svg viewBox="0 0 600 300" className="w-full h-64">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="50"
                y1={50 + i * 50}
                x2="580"
                y2={50 + i * 50}
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-gray-300 dark:text-gray-600"
              />
            ))}

            {/* Bars */}
            {data.map((item, index) => {
              const barHeight = (item.revenue / maxValue) * 200;
              const x = 60 + index * 45;
              const y = 250 - barHeight;

              return (
                <g key={index}>
                  {/* Bar */}
                  <rect
                    x={x}
                    y={y}
                    width="35"
                    height={barHeight}
                    fill="url(#gradient)"
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                  {/* Month label */}
                  <text
                    x={x + 17.5}
                    y="270"
                    textAnchor="middle"
                    className="text-xs fill-gray-600 dark:fill-gray-400"
                  >
                    {months[item.month - 1]}
                  </text>
                  {/* Value label */}
                  <text
                    x={x + 17.5}
                    y={y - 5}
                    textAnchor="middle"
                    className="text-xs fill-gray-700 dark:fill-gray-300 font-semibold"
                  >
                    {item.orders}
                  </text>
                </g>
              );
            })}

            {/* Gradient */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Total Receita</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {data
              .reduce((sum, item) => sum + item.revenue, 0)
              .toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Total Pedidos</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {data.reduce((sum, item) => sum + item.orders, 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Ticket Médio</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {(
              data.reduce((sum, item) => sum + item.revenue, 0) /
              Math.max(
                data.reduce((sum, item) => sum + item.orders, 0),
                1,
              )
            ).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

const FinancialReports = () => {
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Buscar estatísticas financeiras
  const { data: financial, isLoading: loadingFinancial } =
    useQuery<FinancialStatistics>({
      queryKey: ['financial-statistics', startDate, endDate],
      queryFn: () => fetchFinancialStatistics(startDate, endDate),
    });

  // Buscar lucratividade por produto
  const { data: profitability, isLoading: loadingProfitability } = useQuery<
    ProductProfitability[]
  >({
    queryKey: ['product-profitability', startDate, endDate],
    queryFn: () => fetchProductProfitability(startDate, endDate),
  });

  // Buscar receita mensal
  const { data: monthlyRevenue, isLoading: loadingMonthly } = useQuery<
    MonthlyRevenue[]
  >({
    queryKey: ['monthly-revenue', selectedYear],
    queryFn: () => fetchMonthlyRevenue(selectedYear),
  });

  const isLoading = loadingFinancial || loadingProfitability || loadingMonthly;

  // Formatador de moeda
  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

  // Formatador de percentual
  const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

  return (
    <div className="mt-8 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
          Relatórios Financeiros
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Análise detalhada de receitas, custos e lucratividade
        </p>
      </div>

      {/* Filtros de Data */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <FaCalendar className="text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Período de Análise
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Inicial
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data Final
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ano (Receita Mensal)
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {Array.from(
                { length: 5 },
                (_, i) => new Date().getFullYear() - i,
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <FaSpinner className="animate-spin text-4xl text-gray-400" />
        </div>
      ) : (
        <>
          {/* Resumo Financeiro */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Receita Total"
              value={formatCurrency(financial?.totalRevenue || 0)}
              subtitle={`${financial?.totalOrders || 0} pedidos`}
              color="blue"
            />
            <MetricCard
              title="Custo Total"
              value={formatCurrency(financial?.totalCost || 0)}
              subtitle="Custo dos produtos vendidos"
              color="orange"
            />
            <MetricCard
              title="Lucro Bruto"
              value={formatCurrency(financial?.grossProfit || 0)}
              subtitle={`Margem: ${formatPercentage(financial?.grossProfitMargin || 0)}`}
              color="green"
            />
            <MetricCard
              title="Lucro Líquido"
              value={formatCurrency(financial?.netProfit || 0)}
              subtitle={`Margem: ${formatPercentage(financial?.netProfitMargin || 0)}`}
              color={(financial?.netProfit || 0) >= 0 ? 'green' : 'red'}
            />
          </div>

          {/* Detalhamento de Receitas e Custos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaChartLine className="text-blue-500" />
                Análise de Receitas
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Receita Completada
                  </span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(financial?.totalRevenueCompleted || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Receita Pendente
                  </span>
                  <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    {formatCurrency(financial?.totalRevenuePending || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Receita Total
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(financial?.totalRevenue || 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaChartPie className="text-purple-500" />
                Análise de Custos
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Custo dos Produtos
                  </span>
                  <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {formatCurrency(financial?.totalCost || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Despesas Operacionais
                  </span>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(financial?.totalExpenses || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Custo Total
                  </span>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {formatCurrency(
                      (financial?.totalCost || 0) +
                        (financial?.totalExpenses || 0),
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Despesas por Categoria */}
          {financial?.expensesByCategory &&
            financial.expensesByCategory.length > 0 && (
              <HorizontalBarChart
                title="Despesas por Categoria"
                data={financial.expensesByCategory.map((item) => ({
                  label: item.category,
                  value: item.total,
                }))}
              />
            )}

          {/* Receita Mensal */}
          {monthlyRevenue && monthlyRevenue.length > 0 && (
            <MonthlyRevenueChart data={monthlyRevenue} />
          )}

          {/* Produtos Mais Lucrativos */}
          {profitability && profitability.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaTrophy className="text-yellow-500" />
                Produtos Mais Lucrativos
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-6 py-3 text-left">#</th>
                      <th className="px-6 py-3 text-left">Produto</th>
                      <th className="px-6 py-3 text-right">Vendidos</th>
                      <th className="px-6 py-3 text-right">Receita</th>
                      <th className="px-6 py-3 text-right">Custo</th>
                      <th className="px-6 py-3 text-right">Lucro</th>
                      <th className="px-6 py-3 text-right">Margem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {profitability.slice(0, 10).map((product, index) => (
                      <tr
                        key={product.productId}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {product.productName}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">
                          {product.totalSold}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">
                          {formatCurrency(product.totalRevenue)}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">
                          {formatCurrency(product.totalCost)}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(product.grossProfit)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              product.profitMargin >= 50
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : product.profitMargin >= 30
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            }`}
                          >
                            {formatPercentage(product.profitMargin)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pedidos por Status */}
          {financial?.ordersByStatus && financial.ordersByStatus.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Pedidos por Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {financial.ordersByStatus.map((status) => (
                  <div
                    key={status.status}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {status.status}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {status.count}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {formatCurrency(status.totalAmount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FinancialReports;
