import { useState } from 'react';
import ExpenseList from './ExpenseList';
import ExpenseForm from './ExpenseForm';
import { type Expense } from '../../../api/expenses';
import { FaArrowLeft } from 'react-icons/fa';

const ExpensesPage = () => {
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>();

  const handleAdd = () => {
    setSelectedExpense(undefined);
    setMode('create');
  };

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setMode('edit');
  };

  const handleSuccess = () => {
    setMode('list');
    setSelectedExpense(undefined);
  };

  const handleCancel = () => {
    setMode('list');
    setSelectedExpense(undefined);
  };

  return (
    <div className="mt-8">
      {mode === 'list' ? (
        <ExpenseList onEdit={handleEdit} onAdd={handleAdd} />
      ) : (
        <div className="space-y-4">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <FaArrowLeft />
            Voltar para lista
          </button>
          <ExpenseForm
            expense={selectedExpense}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
};

export default ExpensesPage;
