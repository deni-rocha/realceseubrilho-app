import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import {
  createExpense,
  updateExpense,
  type Expense,
  type CreateExpenseDto,
  type ExpenseCategory,
} from '../../../api/expenses';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

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

interface ExpenseFormProps {
  expense?: Expense;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  description: string;
  amount: number;
  category: keyof ExpenseCategory;
  expenseDate: string;
  notes?: string;
  receiptUrl?: string;
}

const ExpenseForm = ({ expense, onSuccess, onCancel }: ExpenseFormProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!expense;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: expense
      ? {
          description: expense.description,
          amount: expense.amount,
          category: expense.category,
          expenseDate: expense.expenseDate,
          notes: expense.notes || '',
          receiptUrl: expense.receiptUrl || '',
        }
      : {
          expenseDate: new Date().toISOString().split('T')[0],
          category: 'OTHER',
        },
  });

  // Mutation para criar
  const createMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      toast.success('Despesa criada com sucesso!');
      reset();
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erro ao criar despesa');
    },
  });

  // Mutation para atualizar
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateExpenseDto }) =>
      updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      toast.success('Despesa atualizada com sucesso!');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Erro ao atualizar despesa',
      );
    },
  });

  const onSubmit = (data: FormData) => {
    const payload: CreateExpenseDto = {
      description: data.description,
      amount: Number(data.amount),
      category: data.category,
      expenseDate: data.expenseDate,
      notes: data.notes || undefined,
      receiptUrl: data.receiptUrl || undefined,
    };

    if (isEditing) {
      updateMutation.mutate({ id: expense.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (expense) {
      reset({
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        expenseDate: expense.expenseDate,
        notes: expense.notes || '',
        receiptUrl: expense.receiptUrl || '',
      });
    }
  }, [expense, reset]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {isEditing ? 'Editar Despesa' : 'Nova Despesa'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descrição <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('description', {
              required: 'Descrição é obrigatória',
              minLength: {
                value: 3,
                message: 'Descrição deve ter no mínimo 3 caracteres',
              },
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.description
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Ex: Anúncio no Google Ads"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Valor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Valor (R$) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              {...register('amount', {
                required: 'Valor é obrigatório',
                min: {
                  value: 0.01,
                  message: 'Valor deve ser maior que zero',
                },
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.amount
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-500">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria <span className="text-red-500">*</span>
            </label>
            <select
              {...register('category', {
                required: 'Categoria é obrigatória',
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                errors.category
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">
                {errors.category.message}
              </p>
            )}
          </div>
        </div>

        {/* Data */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Data da Despesa <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register('expenseDate', {
              required: 'Data é obrigatória',
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.expenseDate
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.expenseDate && (
            <p className="mt-1 text-sm text-red-500">
              {errors.expenseDate.message}
            </p>
          )}
        </div>

        {/* Observações */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Observações
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Informações adicionais sobre esta despesa..."
          />
        </div>

        {/* URL do Comprovante */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            URL do Comprovante
          </label>
          <input
            type="url"
            {...register('receiptUrl', {
              pattern: {
                value: /^https?:\/\/.+/,
                message: 'URL inválida',
              },
            })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
              errors.receiptUrl
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="https://exemplo.com/nota-fiscal.pdf"
          />
          {errors.receiptUrl && (
            <p className="mt-1 text-sm text-red-500">
              {errors.receiptUrl.message}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Cole o link do comprovante/nota fiscal hospedado na nuvem
          </p>
        </div>

        {/* Botões */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <FaTimes />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isPending ? (
              <>
                <FaSpinner className="animate-spin" />
                {isEditing ? 'Salvando...' : 'Criando...'}
              </>
            ) : (
              <>
                <FaSave />
                {isEditing ? 'Salvar Alterações' : 'Criar Despesa'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
