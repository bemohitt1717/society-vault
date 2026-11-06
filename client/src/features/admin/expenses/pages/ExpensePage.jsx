import { Plus, Search } from 'lucide-react';
import ExpenseTable from '../components/ExpenseTable';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseDetailDrawer from '../components/ExpenseDetailDrawer';
import { paymentStatuses } from '../data/expenseOptions';
import useExpensePage from '../hooks/useExpensePage';
import {
  adminFormFieldClass,
  adminPrimaryButtonClass,
  filterActionButtonClass,
} from '../../../../components/ui/actionButtonStyles';
import LoadingState from '../../../../components/ui/LoadingState';

const ExpensePage = () => {
  const {
    showForm, showDetail, editingExpense, viewingExpense, transactions, stats, categories, filters,
    setFilters, handleAddExpense, handleEditExpense, handleViewExpense, handleCloseForm,
    handleCloseDetail, handleSaveExpense, handleDeleteExpense, handleClearFilters, handleDetailEdit,
    page, total, totalPages, isLoading, isSaving, isDeleting, error, actionError, retry, setPage,
  } = useExpensePage();
  return (
    <div className="space-y-4">
      {error && (
        <div role="alert" className="flex items-center justify-between gap-3 rounded-lg border border-[#8d4b4d] bg-[#2c1d20] px-4 py-3 text-sm text-[#f0b2b4]">
          <span>{error}</span>
          <button type="button" onClick={retry} className="font-semibold underline">Retry</button>
        </div>
      )}
      {isLoading && <LoadingState label="Loading expense records..." className="min-h-20" />}
      {/* Top Bar: KPI Cards + Add Button */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Stats Cards - Fixed width, equal sized */}
        <div className="flex gap-2 md:gap-3 w-full md:w-[45%]">
          <div className="flex-1 bg-[#1a1a1e] border border-[#26262b] rounded-xl p-2.5 md:p-4 hover:border-[#2e2f33] transition-all duration-300 min-w-0">
            <h2 className="text-lg md:text-2xl font-bold text-[#fffffe] mb-0.5 md:mb-1 truncate">₹{stats.totalExpenses.toLocaleString()}</h2>
            <p className="text-[10px] md:text-xs text-[#8b8b90] mb-1 md:mb-2">Total</p>
          </div>

          <div className="flex-1 bg-[#1a1a1e] border border-[#26262b] rounded-xl p-2.5 md:p-4 hover:border-[#2e2f33] transition-all duration-300 min-w-0">
            <h2 className="text-lg md:text-2xl font-bold text-[#fffffe] mb-0.5 md:mb-1 truncate">{stats.transactionCount}</h2>
            <p className="text-[10px] md:text-xs text-[#8b8b90] truncate">Transactions</p>
          </div>

          <div className="flex-1 bg-[#1a1a1e] border border-[#26262b] rounded-xl p-2.5 md:p-4 hover:border-[#2e2f33] transition-all duration-300 min-w-0">
            <h2 className="text-lg md:text-2xl font-bold text-[#fffffe] mb-0.5 md:mb-1 truncate" title={stats.topCategory}>{stats.topCategory || '—'}</h2>
            <p className="text-[10px] md:text-xs text-[#8b8b90] truncate">Top Category</p>
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={handleAddExpense}
          className={`${adminPrimaryButtonClass} w-full flex-shrink-0 md:w-auto`}
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      {/* Table + Filters Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Table - Left Side (takes more space) */}
        <div className="xl:col-span-9">
          <ExpenseTable
            transactions={transactions}
            onEdit={handleEditExpense}
            onView={handleViewExpense}
            isLoading={isLoading}
            page={page}
            total={total}
            totalPages={totalPages}
            onPageChange={setPage}
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
                    {categories.map((cat) => (
                      <option key={cat.id || cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#94a1b2] mb-1.5">Vendor</label>
                  <input
                    type="text"
                    value={filters.vendor}
                    onChange={(e) => setFilters({ ...filters, vendor: e.target.value })}
                    className={adminFormFieldClass}
                    placeholder="Vendor name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#94a1b2] mb-1.5">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className={`${adminFormFieldClass} cursor-pointer`}
                  >
                    <option value="">All</option>
                    {paymentStatuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
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
        <ExpenseForm
          key={editingExpense?.id || 'new'}
          expense={editingExpense}
          categories={categories}
          actionError={actionError}
          isSaving={isSaving}
          onSave={handleSaveExpense}
          onClose={handleCloseForm}
        />
      )}

      {/* Detail Drawer */}
      <ExpenseDetailDrawer
        expense={viewingExpense}
        isOpen={showDetail}
        onClose={handleCloseDetail}
        onEdit={handleDetailEdit}
        onDelete={handleDeleteExpense}
        error={actionError}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ExpensePage;
