import { Plus } from 'lucide-react';

const QuickActions = () => {
  const handleAddIncome = () => {
    // TODO: Open Add Income modal/form
  };

  const handleAddExpense = () => {
    // TODO: Open Add Expense modal/form
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        onClick={handleAddIncome}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#2cb67d] text-white rounded-xl font-medium hover:bg-[#25a268] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      >
        <Plus className="w-5 h-5" />
        Add Income
      </button>

      <button
        onClick={handleAddExpense}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#ff6b6b] text-white rounded-xl font-medium hover:bg-[#e65555] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      >
        <Plus className="w-5 h-5" />
        Add Expense
      </button>
    </div>
  );
};

export default QuickActions;
