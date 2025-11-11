import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ComposedChart,
} from 'recharts';
import {
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaFilter,
  FaSpinner,
  FaDownload,
} from 'react-icons/fa';
import {
  fetchFinancialStatistics,
  fetchMonthlyRevenue,
  fetchProductProfitability,
} from '../../../api/statistics';
import { fetchExpensesSummaryByCategory } from '../../../api/expenses';

// Cores para os gráficos
const COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  purple: '#a855f7',
  pink: '#ec4899',
  indigo: '#6366f1',
  teal: '#14b8a6',
};

const CHART_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.success,
  COLORS.warning,
  COLORS.danger,
  COLORS.info,
  COLORS.purple,
  COLORS.pink,
  COLORS.indigo,
  COLORS.teal,
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
          <p
            key={index}
            className="text-sm text-gray-600 dark:text-gray-400"
            style={{ color: entry.color }}
          >
            {entry.name}:{' '}
            {typeof entry.value === 'number'
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

// Componente de filtros
const ChartFilters = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  selectedYear,
  onYearChange,
  chartType,
  onChartTypeChange,
}: {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  selectedYear: number;
  onYearChange: (year: number) => void;
  chartType: string;
  onChartTypeChange: (type: string) => void;
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <FaFilter className="text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filtros e Visualização
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Tipo de Gráfico */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de Gráfico
          </label>
          <select
            value={chartType}
            onChange={(e) => onChartTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="revenue">Receita no Tempo</option>
            <option value="expenses">Despesas por Categoria</option>
            <option value="profit">Lucro Comparativo</option>
            <option value="products">Top Produtos</option>
            <option value="monthly">Análise Mensal</option>
          </select>
        </div>

        {/* Data Inicial */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Data Inicial
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Data Final */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Data Final
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Ano */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ano
          </label>
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
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
  );
};

const FinancialCharts = () => {
  const [chartType, setChartType] = useState('revenue');
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Buscar dados
  const { data: financial, isLoading: loadingFinancial } = useQuery({
    queryKey: ['financial-statistics', startDate, endDate],
    queryFn: () => fetchFinancialStatistics(startDate, endDate),
  });

  const { data: monthlyRevenue, isLoading: loadingMonthly } = useQuery({
    queryKey: ['monthly-revenue', selectedYear],
    queryFn: () => fetchMonthlyRevenue(selectedYear),
  });

  const { data: profitability, isLoading: loadingProfitability } = useQuery({
    queryKey: ['product-profitability', startDate, endDate],
    queryFn: () => fetchProductProfitability(startDate, endDate),
  });

  const { data: expensesByCategory, isLoading: loadingExpenses } = useQuery({
    queryKey: ['expenses-by-category'],
    queryFn: fetchExpensesSummaryByCategory,
  });

  const isLoading =
    loadingFinancial ||
    loadingMonthly ||
    loadingProfitability ||
    loadingExpenses;

  // Preparar dados para gráficos
  const revenueData = useMemo(() => {
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

  const expensesData = useMemo(() => {
    if (!expensesByCategory) return [];
    return expensesByCategory
      .map((item) => ({
        categoria: item.category,
        total: item.total,
        quantidade: item.count,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [expensesByCategory]);

  const profitData = useMemo(() => {
    if (!financial) return [];
    return [
      {
        nome: 'Receita Total',
        valor: financial.totalRevenue,
      },
      {
        nome: 'Custo Produtos',
        valor: financial.totalCost,
      },
      {
        nome: 'Despesas',
        valor: financial.totalExpenses,
      },
      {
        nome: 'Lucro Bruto',
        valor: financial.grossProfit,
      },
      {
        nome: 'Lucro Líquido',
        valor: financial.netProfit,
      },
    ];
  }, [financial]);

  const topProductsData = useMemo(() => {
    if (!profitability) return [];
    return profitability
      .sort((a, b) => b.grossProfit - a.grossProfit)
      .slice(0, 10)
      .map((item) => ({
        produto: item.productName.substring(0, 20),
        lucro: item.grossProfit,
        receita: item.totalRevenue,
        margem: item.profitMargin,
      }));
  }, [profitability]);

  const profitMarginData = useMemo(() => {
    if (!financial) return [];
    return [
      { nome: 'Lucro Bruto', valor: financial.grossProfitMargin },
      {
        nome: 'Despesas',
        valor:
          financial.totalRevenue > 0
            ? (financial.totalExpenses / financial.totalRevenue) * 100
            : 0,
      },
      { nome: 'Lucro Líquido', valor: financial.netProfitMargin },
    ];
  }, [financial]);

  // Renderizar gráfico baseado no tipo selecionado
  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <FaSpinner className="animate-spin text-4xl text-gray-400" />
        </div>
      );
    }

    switch (chartType) {
      case 'revenue':
        return (
          <div className="space-y-6">
            {/* Gráfico de Área - Receita no Tempo */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaChartLine className="text-blue-500" />
                Evolução da Receita ({selectedYear})
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient
                      id="colorReceita"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
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
                    <linearGradient id="colorCusto" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={COLORS.danger}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS.danger}
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
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <YAxis className="text-gray-600 dark:text-gray-400" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="receita"
                    stroke={COLORS.primary}
                    fillOpacity={1}
                    fill="url(#colorReceita)"
                    name="Receita"
                  />
                  <Area
                    type="monotone"
                    dataKey="custo"
                    stroke={COLORS.danger}
                    fillOpacity={1}
                    fill="url(#colorCusto)"
                    name="Custo"
                  />
                  <Area
                    type="monotone"
                    dataKey="lucro"
                    stroke={COLORS.success}
                    fillOpacity={1}
                    fill="url(#colorLucro)"
                    name="Lucro"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de Linha - Pedidos */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Pedidos por Mês
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200 dark:stroke-gray-700"
                  />
                  <XAxis
                    dataKey="mes"
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <YAxis className="text-gray-600 dark:text-gray-400" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pedidos"
                    stroke={COLORS.secondary}
                    strokeWidth={3}
                    name="Pedidos"
                    dot={{ fill: COLORS.secondary, r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'expenses':
        return (
          <div className="space-y-6">
            {/* Gráfico de Barras - Despesas */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaChartBar className="text-purple-500" />
                Despesas por Categoria
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={expensesData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200 dark:stroke-gray-700"
                  />
                  <XAxis
                    type="number"
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <YAxis
                    dataKey="categoria"
                    type="category"
                    width={120}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="total" name="Total" radius={[0, 8, 8, 0]}>
                    {expensesData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de Pizza - Distribuição */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaChartPie className="text-pink-500" />
                Distribuição de Despesas
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={expensesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) =>
                      `${props.categoria}: ${((props.percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="total"
                  >
                    {expensesData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'profit':
        return (
          <div className="space-y-6">
            {/* Gráfico Comparativo */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Análise Comparativa de Lucro
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={profitData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200 dark:stroke-gray-700"
                  />
                  <XAxis
                    dataKey="nome"
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <YAxis className="text-gray-600 dark:text-gray-400" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="valor" name="Valor" radius={[8, 8, 0, 0]}>
                    {profitData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.nome.includes('Lucro')
                            ? COLORS.success
                            : entry.nome.includes('Receita')
                              ? COLORS.primary
                              : COLORS.danger
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de Pizza - Margens */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Composição das Margens (%)
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={profitMarginData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) =>
                      `${props.nome}: ${props.valor.toFixed(2)}%`
                    }
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="valor"
                  >
                    <Cell fill={COLORS.success} />
                    <Cell fill={COLORS.danger} />
                    <Cell fill={COLORS.purple} />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'products':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top 10 Produtos Mais Lucrativos
            </h3>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={topProductsData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-gray-700"
                />
                <XAxis
                  type="number"
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis
                  dataKey="produto"
                  type="category"
                  width={150}
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="lucro"
                  fill={COLORS.success}
                  name="Lucro"
                  radius={[0, 8, 8, 0]}
                />
                <Bar
                  dataKey="receita"
                  fill={COLORS.primary}
                  name="Receita"
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'monthly':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Análise Mensal Completa ({selectedYear})
            </h3>
            <ResponsiveContainer width="100%" height={500}>
              <ComposedChart data={revenueData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-gray-700"
                />
                <XAxis
                  dataKey="mes"
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis className="text-gray-600 dark:text-gray-400" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="receita"
                  fill={COLORS.primary}
                  name="Receita"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="custo"
                  fill={COLORS.danger}
                  name="Custo"
                  radius={[8, 8, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="lucro"
                  stroke={COLORS.success}
                  strokeWidth={3}
                  name="Lucro"
                  dot={{ fill: COLORS.success, r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            Gráficos Financeiros
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Visualizações interativas com filtros personalizados
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaDownload />
          Exportar
        </button>
      </div>

      {/* Filtros */}
      <ChartFilters
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        chartType={chartType}
        onChartTypeChange={setChartType}
      />

      {/* Resumo Rápido */}
      {financial && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white">
            <p className="text-sm opacity-90">Receita</p>
            <p className="text-2xl font-bold">
              {financial.totalRevenue.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg text-white">
            <p className="text-sm opacity-90">Lucro Bruto</p>
            <p className="text-2xl font-bold">
              {financial.grossProfit.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg text-white">
            <p className="text-sm opacity-90">Lucro Líquido</p>
            <p className="text-2xl font-bold">
              {financial.netProfit.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-lg text-white">
            <p className="text-sm opacity-90">Margem Líquida</p>
            <p className="text-2xl font-bold">
              {financial.netProfitMargin.toFixed(2)}%
            </p>
          </div>
        </div>
      )}

      {/* Gráficos */}
      {renderChart()}
    </div>
  );
};

export default FinancialCharts;
