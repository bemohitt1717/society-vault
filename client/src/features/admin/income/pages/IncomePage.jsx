import { Plus, Search, TrendingUp } from 'lucide-react';
import IncomeTable from '../components/IncomeTable';
import IncomeForm from '../components/IncomeForm';
import IncomeDetailDrawer from '../components/IncomeDetailDrawer';
import { incomeCategories, paymentModes } from '../data/mockIncomeData';
import useIncomePage from '../hooks/useIncomePage';
import {
  adminFormFieldClass,
  adminPrimaryButtonClass,
  filterActionButtonClass,
} from '../../../../components/ui/actionButtonStyles';

const IncomePage = () => {
  const {
    showForm, showDetail, editingIncome, viewingIncome, transactions, stats, filters,
    setFilters, handleAddIncome, handleEditIncome, handleViewIncome, handleCloseForm,
    handleCloseDetail, handleSaveIncome, handleDeleteIncome, handleClearFilters, handleDetailEdit,
  } = useIncomePage();
  return (
    <div className="space-y-4">
      {/* Top Bar: KPI Cards + Add Button */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Stats Cards - Fixed width, equal sized */}
        <div className="flex gap-2 md:gap-3 w-full md:w-[45%]">
          <div className="flex-1 bg-[#1a1a1e] border border-[#26262b] rounded-xl p-2.5 md:p-4 hover:border-[#2e2f33] transition-all duration-300 min-w-0">
            <h2 className="text-lg md:text-2xl font-bold text-[#fffffe] mb-0.5 md:mb-1 truncate">₹{stats.totalIncome.toLocaleString()}</h2>
            <p className="text-[10px] md:text-xs text-[#8b8b90] mb-1 md:mb-2">Total</p>
            <div className="flex items-center gap-1 md:gap-2">
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#2cb67d]/15 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3 text-[#8db5a2]" strokeWidth={2.5} />
              </div>
              <span className="text-[10px] md:text-xs font-semibold text-[#8db5a2]">+12.5%</span>
            </div>
          </div>

          <div className="flex-1 bg-[#1a1a1e] border border-[#26262b] rounded-xl p-2.5 md:p-4 hover:border-[#2e2f33] transition-all duration-300 min-w-0">
            <h2 className="text-lg md:text-2xl font-bold text-[#fffffe] mb-0.5 md:mb-1 truncate">{stats.transactionCount}</h2>
            <p className="text-[10px] md:text-xs text-[#8b8b90] truncate">Transactions</p>
          </div>

          <div className="flex-1 bg-[#1a1a1e] border border-[#26262b] rounded-xl p-2.5 md:p-4 hover:border-[#2e2f33] transition-all duration-300 min-w-0">
            <h2 className="text-lg md:text-2xl font-bold text-[#fffffe] mb-0.5 md:mb-1 truncate">₹{stats.averageAmount.toLocaleString()}</h2>
            <p className="text-[10px] md:text-xs text-[#8b8b90] truncate">Avg Amount</p>
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={handleAddIncome}
          className={`${adminPrimaryButtonClass} w-full flex-shrink-0 md:w-auto`}
        >
          <Plus className="w-4 h-4" />
          Add Income
        </button>
      </div>

      {/* Table + Filters Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Table - Left Side (takes more space) */}
        <div className="xl:col-span-9">
          <IncomeTable
            transactions={transactions}
            onEdit={handleEditIncome}
            onView={handleViewIncome}
          />
        </div>

        {/* Search & Filters - Right Side */}
        <div className="xl:col-span-3">
          <div className="sticky top-4 space-y-4 rounded-xl border border-[#303136] bg-[#1a1a1e] p-4">
            {/* Search */}
            <div>
              <label className="block text-xs font-semibold text-[#fffffe] uppercase tracking-wider mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a1b2]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className={`${adminFormFieldClass} pl-10 pr-3`}
                />
              </div>
            </div>

            {/* Filters Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-[#fffffe] uppercase tracking-wider">Filters</label>
                <button
                  onClick={handleClearFilters}
                  className={filterActionButtonClass}
                >
                  Clear
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#94a1b2] mb-1.5">Date From</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className={adminFormFieldClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#94a1b2] mb-1.5">Date To</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className={adminFormFieldClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#94a1b2] mb-1.5">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className={`${adminFormFieldClass} cursor-pointer`}
                  >
                    <option value="">All</option>
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
                    className={`${adminFormFieldClass} cursor-pointer`}
                  >
                    <option value="">All</option>
                    {paymentModes.map((mode) => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal/Drawer */}
      {showForm && (
        <IncomeForm
          key={editingIncome?.id || 'new'}
          income={editingIncome}
          onSave={handleSaveIncome}
          onClose={handleCloseForm}
        />
      )}

      {/* Detail Drawer */}
      {showDetail && viewingIncome && (
        <IncomeDetailDrawer
          income={viewingIncome}
          onClose={handleCloseDetail}
          onEdit={handleDetailEdit}
          onDelete={handleDeleteIncome}
        />
      )}
    </div>
  );
};

export default IncomePage;
