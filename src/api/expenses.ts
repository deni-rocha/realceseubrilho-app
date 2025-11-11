import api from './index';

export interface ExpenseCategory {
  INVENTORY: 'INVENTORY';
  MARKETING: 'MARKETING';
  SHIPPING: 'SHIPPING';
  PACKAGING: 'PACKAGING';
  OPERATIONAL: 'OPERATIONAL';
  SALARY: 'SALARY';
  TAXES: 'TAXES';
  MAINTENANCE: 'MAINTENANCE';
  SOFTWARE: 'SOFTWARE';
  OTHER: 'OTHER';
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: keyof ExpenseCategory;
  expenseDate: string;
  notes?: string;
  receiptUrl?: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseDto {
  description: string;
  amount: number;
  category: keyof ExpenseCategory;
  expenseDate: string;
  notes?: string;
  receiptUrl?: string;
}

export interface UpdateExpenseDto {
  description?: string;
  amount?: number;
  category?: keyof ExpenseCategory;
  expenseDate?: string;
  notes?: string;
  receiptUrl?: string;
}

export interface ExpenseSummaryByCategory {
  category: keyof ExpenseCategory;
  total: number;
  count: number;
}

export interface TotalExpenseResponse {
  total: number;
}

export interface TotalByCategoryResponse {
  category: keyof ExpenseCategory;
  total: number;
}

export interface TotalByDateRangeResponse {
  startDate: string;
  endDate: string;
  total: number;
}

// Criar despesa
export const createExpense = async (
  data: CreateExpenseDto,
): Promise<Expense> => {
  const response = await api.post<Expense>('/expenses', data);
  return response.data;
};

// Listar todas as despesas
export const fetchExpenses = async (): Promise<Expense[]> => {
  const response = await api.get<Expense[]>('/expenses');
  return response.data;
};

// Buscar despesa por ID
export const fetchExpenseById = async (id: string): Promise<Expense> => {
  const response = await api.get<Expense>(`/expenses/${id}`);
  return response.data;
};

// Buscar despesas por categoria
export const fetchExpensesByCategory = async (
  category: keyof ExpenseCategory,
): Promise<Expense[]> => {
  const response = await api.get<Expense[]>(`/expenses/category/${category}`);
  return response.data;
};

// Buscar despesas por período
export const fetchExpensesByDateRange = async (
  startDate: string,
  endDate: string,
): Promise<Expense[]> => {
  const response = await api.get<Expense[]>('/expenses/date-range', {
    params: { startDate, endDate },
  });
  return response.data;
};

// Total de despesas
export const fetchTotalExpenses = async (): Promise<number> => {
  const response = await api.get<TotalExpenseResponse>('/expenses/total');
  return response.data.total;
};

// Total por categoria
export const fetchTotalByCategory = async (
  category: keyof ExpenseCategory,
): Promise<number> => {
  const response = await api.get<TotalByCategoryResponse>(
    `/expenses/total/category/${category}`,
  );
  return response.data.total;
};

// Total por período
export const fetchTotalByDateRange = async (
  startDate: string,
  endDate: string,
): Promise<number> => {
  const response = await api.get<TotalByDateRangeResponse>(
    '/expenses/total/date-range',
    {
      params: { startDate, endDate },
    },
  );
  return response.data.total;
};

// Resumo por categoria
export const fetchExpensesSummaryByCategory =
  async (): Promise<ExpenseSummaryByCategory[]> => {
    const response = await api.get<ExpenseSummaryByCategory[]>(
      '/expenses/summary/by-category',
    );
    return response.data;
  };

// Atualizar despesa
export const updateExpense = async (
  id: string,
  data: UpdateExpenseDto,
): Promise<Expense> => {
  const response = await api.patch<Expense>(`/expenses/${id}`, data);
  return response.data;
};

// Deletar despesa
export const deleteExpense = async (id: string): Promise<void> => {
  await api.delete(`/expenses/${id}`);
};
