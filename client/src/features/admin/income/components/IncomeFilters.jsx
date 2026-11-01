import { incomeCategories, paymentModes } from '../data/mockIncomeData';
import { resetFilterButtonClass } from '../../../../components/ui/actionButtonStyles';

const IncomeFilters = ({ filters, setFilters }) => {
  const handleClearFilters = () => {
    setFilters({
      search: '',
      dateFrom: '',
      dateTo: '',
      category: '',
      paymentMode: ''
    });
  };

  return (
    <div className="pt-4 mt-4 border-t border-[#2e2f33] space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#94a1b2] mb-1.5">Date From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            className="w-full px-3 py-2 bg-[#16161a] border border-[#2e2f33] rounded-lg text-[#fffffe] text-sm focus:outline-none focus:border-[#7f5af0] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#94a1b2] mb-1.5">Date To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            className="w-full px-3 py-2 bg-[#16161a] border border-[#2e2f33] rounded-lg text-[#fffffe] text-sm focus:outline-none focus:border-[#7f5af0] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#94a1b2] mb-1.5">Category</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="w-full px-3 py-2 bg-[#16161a] border border-[#2e2f33] rounded-lg text-[#fffffe] text-sm focus:outline-none focus:border-[#7f5af0] transition-colors cursor-pointer"
          >
            <option value="">All Categories</option>
            {incomeCategories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#94a1b2] mb-1.5">Payment Mode</label>
          <select
            value={filters.paymentMode}
            onChange={(e) => setFilters({ ...filters, paymentMode: e.target.value })}
            className="w-full px-3 py-2 bg-[#16161a] border border-[#2e2f33] rounded-lg text-[#fffffe] text-sm focus:outline-none focus:border-[#7f5af0] transition-colors cursor-pointer"
          >
            <option value="">All Modes</option>
            {paymentModes.map((mode) => (
              <option key={mode} value={mode}>{mode}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleClearFilters}
          className={resetFilterButtonClass}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default IncomeFilters;
