import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaReceipt,
  FaFilter,
} from 'react-icons/fa';
import {
  fetchExpenses,
  deleteExpense,
  type Expense,
  type ExpenseCategory,
} from '../../../api/expenses';
import { toast } from 'react-toastify';

// Mapeamento de categorias para português
const categoryLabels: Record<keyof ExpenseCategory, string> = {
  INVENTORY: 'Estoque',
  MARKETING: 'Marketing',
  SHIPPING: 'Frete',
  PACKAGING: 'Embalagem',
  OPERATIONAL: 'Operacional',
  SALARY: 'Salário',
  TAXES: 'Impostos',
  MAINTENANCE: 'Manutenção',
  SOFTWARE: 'Software',
  OTHER: 'Outros',
};

// Cores para categorias
const categoryColors: Record<keyof ExpenseCategory, string> = {
  INVENTORY: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  MARKETING:
    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  SHIPPING:
    'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  PACKAGING: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  OPERATIONAL: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  SALARY:
    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  TAXES: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  MAINTENANCE:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  SOFTWARE:
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  OTHER: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
};

interface ExpenseListProps {
  onEdit: (expense: Expense) => void;
  onAdd: () => void;
}

const ExpenseList = ({ onEdit, onAdd }: ExpenseListProps) => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Buscar despesas
  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: fetchExpenses,
  });

  // Mutation para deletar
  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      toast.success('Despesa removida com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao remover despesa');
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover esta despesa?')) {
      deleteMutation.mutate(id);
    }
  };

  // Filtrar despesas
  const filteredExpenses = expenses?.filter((expense) => {
    const matchesCategory =
      selectedCategory === 'all' || expense.category === selectedCategory;
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calcular total filtrado
  const totalFiltered =
    filteredExpenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Formatar moeda
  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

  if (isLoading) {
    return (
      <div className="p-6 text-gray-700 dark:text-gray-300 flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center">
          <FaSpinner className="w-8 h-8 text-green-600 animate-spin mb-2" />
          <span>Carregando despesas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com Filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Despesas
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gerencie as despesas operacionais
          </p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus />
          Nova Despesa
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FaFilter className="inline mr-2" />
              Filtrar por Categoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todas as Categorias</option>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por descrição ou observações..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Total Filtrado */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Total ({filteredExpenses?.length || 0} despesas):
            </span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalFiltered)}
            </span>
          </div>
        </div>
      </div>

      {/* Lista de Despesas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredExpenses && filteredExpenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(expense.expenseDate)}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {expense.description}
                        </p>
                        {expense.notes && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {expense.notes}
                          </p>
                        )}
                        {expense.receiptUrl && (
                          <a
                            href={expense.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 mt-1"
                          >
                            <FaReceipt />
                            Ver Comprovante
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          categoryColors[expense.category]
                        }`}
                      >
                        {categoryLabels[expense.category]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEdit(expense)}
                          className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          disabled={deleteMutation.isPending}
                          className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                          title="Remover"
                        >
                          {deleteMutation.isPending ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FaReceipt className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || selectedCategory !== 'all'
                ? 'Nenhuma despesa encontrada com os filtros aplicados'
                : 'Nenhuma despesa cadastrada'}
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="mt-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm"
              >
                Limpar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* Resumo por Categoria */}
      {filteredExpenses && filteredExpenses.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Resumo por Categoria
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(
              filteredExpenses.reduce(
                (acc, expense) => {
                  acc[expense.category] =
                    (acc[expense.category] || 0) + expense.amount;
                  return acc;
                },
                {} as Record<string, number>,
              ),
            )
              .sort(([, a], [, b]) => b - a)
              .map(([category, total]) => (
                <div
                  key={category}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        categoryColors[category as keyof ExpenseCategory]
                      }`}
                    >
                      {categoryLabels[category as keyof ExpenseCategory]}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatCurrency(total)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
