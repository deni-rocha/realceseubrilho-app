import api from './index';

export interface DashboardSummary {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalExpenses: number;
  totalCost: number;
  grossProfit: number;
  netProfit: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
}

export interface OrdersByStatus {
  status: string;
  count: number;
  totalAmount: number;
}

export interface ExpensesByCategory {
  category: string;
  total: number;
  count: number;
}

export interface FinancialStatistics {
  totalRevenue: number;
  totalRevenueCompleted: number;
  totalRevenuePending: number;
  totalCost: number;
  totalCostCompleted: number;
  grossProfit: number;
  grossProfitCompleted: number;
  grossProfitMargin: number;
  totalExpenses: number;
  expensesByCategory: ExpensesByCategory[];
  netProfit: number;
  netProfitMargin: number;
  totalOrders: number;
  ordersByStatus: OrdersByStatus[];
  startDate?: string;
  endDate?: string;
}

export interface ProductProfitability {
  productId: string;
  productName: string;
  totalSold: number;
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  profitMargin: number;
}

export interface MonthlyRevenue {
  month: number;
  revenue: number;
  cost: number;
  profit: number;
  orders: number;
}

// Buscar dashboard resumido
export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await api.get<DashboardSummary>('/statistics/dashboard');
  return response.data;
};

// Buscar estatísticas financeiras
export const fetchFinancialStatistics = async (
  startDate?: string,
  endDate?: string,
): Promise<FinancialStatistics> => {
  const params: { startDate?: string; endDate?: string } = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await api.get<FinancialStatistics>(
    '/statistics/financial',
    { params },
  );
  return response.data;
};

// Buscar lucratividade por produto
export const fetchProductProfitability = async (
  startDate?: string,
  endDate?: string,
): Promise<ProductProfitability[]> => {
  const params: { startDate?: string; endDate?: string } = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await api.get<ProductProfitability[]>(
    '/statistics/products/profitability',
    { params },
  );
  return response.data;
};

// Buscar receita mensal
export const fetchMonthlyRevenue = async (
  year: number,
): Promise<MonthlyRevenue[]> => {
  const response = await api.get<MonthlyRevenue[]>(
    '/statistics/revenue/monthly',
    {
      params: { year },
    },
  );
  return response.data;
};
