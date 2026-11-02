
import { Wallet, TrendingUp, TrendingDown, Percent, Search, Filter, FileSpreadsheet } from 'lucide-react';
import { exportActionButtonClass, exportActionIconClass, resetFilterButtonClass } from '../../../components/ui/actionButtonStyles';
import useSocietyFinancesPage from '../hooks/useSocietyFinancesPage';

const SocietyFinancesPage = () => {
  const { stats, transactions, filters, setFilters, isExporting, isLoading, error, reload, filteredTransactions, formatDate, handleResetFilters, handleExportExcel } = useSocietyFinancesPage();
  const hasActiveFilters = Boolean(filters.search.trim() || filters.dateFrom || filters.dateTo || filters.type);

  return (
    <div className="space-y-6">
      {isLoading && (
        <p role="status" className="rounded-lg border border-[#45414f] bg-[#1a1a1e] px-4 py-3 text-sm text-[#d0d3d9]">
          Loading society finances…
        </p>
      )}
      {error && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#8b4545] bg-[#2a1c1c] px-4 py-3 text-sm text-[#f1b3b3]">
          <span>{error}</span>
          <button type="button" onClick={reload} className="rounded-md border border-[#a45a5a] px-3 py-1.5 font-medium text-white hover:bg-[#402525]">
            Retry
          </button>
        </div>
      )}
      
      {/* KPI Stats Cards - 4 cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-2.5 md:p-4 hover:border-[#2e2f33] transition-all duration-300 min-w-0">
          <div className="space-y-1 md:space-y-2">
            <h2 className="text-lg md:text-2xl font-bold text-[#fffffe] tracking-tight leading-none truncate">
              {isLoading || error ? '—' : `₹${stats.totalIncome.toLocaleString()}`}
            </h2>
            <p className="text-[10px] md:text-xs text-[#8b8b90] font-medium truncate" title="Total Income">
              Total Income
            </p>
          </div>
          <div className="flex items-center gap-1 md:gap-2 mt-2 md:mt-3">
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-[#2cb67d]/15">
              <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3 text-[#2cb67d]" strokeWidth={2.5} />
            </div>
            <span className="text-[10px] md:text-xs font-semibold text-[#2cb67d]">All time</span>
          </div>
        </div>

        <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-2.5 md:p-4 hover:border-[#2e2f33] transition-all duration-300 min-w-0">
          <div className="space-y-1 md:space-y-2">
            <h2 className="text-lg md:text-2xl font-bold text-[#fffffe] tracking-tight leading-none truncate">
              {isLoading || error ? '—' : `₹${stats.totalExpenses.toLocaleString()}`}
            </h2>
            <p className="text-[10px] md:text-xs text-[#8b8b90] font-medium truncate" title="Total Expenses">
              Total Expenses
            </p>
          </div>
          <div className="flex items-center gap-1 md:gap-2 mt-2 md:mt-3">
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-[#ff6b6b]/15">
              <TrendingDown className="w-2.5 h-2.5 md:w-3 md:h-3 text-[#ff6b6b]" strokeWidth={2.5} />
            </div>
            <span className="text-[10px] md:text-xs font-semibold text-[#ff6b6b]">All time</span>
          </div>
        </div>

        <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-2.5 md:p-4 hover:border-[#2e2f33] transition-all duration-300 min-w-0">
          <div className="space-y-1 md:space-y-2">
            <h2 className="text-lg md:text-2xl font-bold text-[#fffffe] tracking-tight leading-none truncate">
              {isLoading || error ? '—' : `₹${stats.availableFunds.toLocaleString()}`}
            </h2>
            <p className="text-[10px] md:text-xs text-[#8b8b90] font-medium truncate" title="Available Funds">
              Available Funds
            </p>
          </div>
          <div className="flex items-center gap-1 md:gap-2 mt-2 md:mt-3">
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-[#7f5af0]/15">
              <Wallet className="w-2.5 h-2.5 md:w-3 md:h-3 text-[#7f5af0]" strokeWidth={2.5} />
            </div>
            <span className="text-[10px] md:text-xs font-semibold text-[#7f5af0]">Current Balance</span>
          </div>
        </div>

        <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-2.5 md:p-4 hover:border-[#2e2f33] transition-all duration-300 min-w-0">
          <div className="space-y-1 md:space-y-2">
            <h2 className="text-lg md:text-2xl font-bold text-[#fffffe] tracking-tight leading-none truncate">
              {isLoading || error ? '—' : `${stats.collectionRate}%`}
            </h2>
            <p className="text-[10px] md:text-xs text-[#8b8b90] font-medium truncate" title="Collection Rate">
              Collection Rate
            </p>
          </div>
          <div className="flex items-center gap-1 md:gap-2 mt-2 md:mt-3">
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-[#ffa500]/15">
              <Percent className="w-2.5 h-2.5 md:w-3 md:h-3 text-[#ffa500]" strokeWidth={2.5} />
            </div>
            <span className="text-[10px] md:text-xs font-semibold text-[#2cb67d]">Paid / due</span>
          </div>
        </div>
      </div>

      {/* Main Layout: Left Table + Right Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Transactions Table (70% width) */}
        <div className="lg:col-span-8">
          {isLoading || error || filteredTransactions.length === 0 ? (
            <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-8 text-center">
              <Filter className="w-12 h-12 mx-auto mb-4 text-[#94a1b2]" />
              <h3 className="text-lg font-semibold text-[#fffffe] mb-2">
                {isLoading ? 'Loading Transactions' : error ? 'Transactions Unavailable' : hasActiveFilters ? 'No Matching Transactions' : 'No Transactions Yet'}
              </h3>
              <p className="text-sm text-[#94a1b2]">
                {isLoading
                  ? 'Transactions are being loaded from the society records.'
                  : error
                    ? 'Retry the request to load society transactions.'
                    : hasActiveFilters
                      ? 'No transactions match these filters. Try changing your search or filters.'
                      : 'Society income and expenses will appear here after an administrator adds them.'}
              </p>
              {!isLoading && !error && hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className={`${resetFilterButtonClass} mt-4`}
                >
                  Reset filters
                </button>
              )}
            </div>
          ) : (
            <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl overflow-hidden">
              <div className="px-4 py-3.5 md:px-5">
                <h3 className="text-base font-semibold text-white">Society Transactions</h3>
                <p className="mt-1 text-xs text-[#b8bec8]">
                  Showing {filteredTransactions.length} of {transactions.length} transactions
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px]">
                  <thead className="border-y border-[#303136] bg-[#1d1e22]">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-[#b8bec8] md:px-5">
                        Date
                      </th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-[#b8bec8] md:px-5">
                        Category
                      </th>
                      <th className="hidden px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-[#b8bec8] lg:table-cell lg:px-5">
                        Description
                      </th>
                      <th className="px-4 py-2.5 text-right text-[11px] font-medium uppercase tracking-wide text-[#b8bec8] md:px-5">
                        Amount
                      </th>
                      <th className="px-4 py-2.5 text-center text-[11px] font-medium uppercase tracking-wide text-[#b8bec8] md:px-5">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2b2c31]">
                    {filteredTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="transition-colors duration-150 hover:bg-[#202125]"
                      >
                        {/* Date */}
                        <td className="whitespace-nowrap px-4 py-3 md:px-5">
                          <div className="text-sm font-medium tabular-nums text-white">
                            {formatDate(transaction.date)}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3 md:px-5">
                          <span className="text-sm font-medium text-white">
                            {transaction.category}
                          </span>
                        </td>

                        {/* Description */}
                        <td className="hidden px-4 py-3 lg:table-cell lg:px-5">
                          <span className="inline-block max-w-[240px] truncate text-sm text-[#c5cad3]">
                            {transaction.description}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="whitespace-nowrap px-4 py-3 text-right md:px-5">
                          <span className="text-sm font-semibold tabular-nums text-white">
                            {transaction.type === 'income' ? '+' : '-'}₹
                            {transaction.amount.toLocaleString()}
                          </span>
                        </td>

                        {/* Type */}
                        <td className="px-4 py-3 text-center md:px-5">
                          <span className="text-xs font-medium capitalize text-[#c5cad3]">
                            {transaction.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Search & Filters (30% width) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Search Box */}
          <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-6">
            <h3 className="text-base font-semibold text-[#fffffe] mb-4">Search</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a1b2]" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={filters.search}
                onChange={(e) => {
                  setFilters({ ...filters, search: e.target.value });
                }}
                className="w-full pl-11 pr-4 py-3 bg-[#242629] border border-[#2e2f33] rounded-lg text-[#fffffe] placeholder-[#94a1b2] focus:outline-none focus:border-[#7f5af0] transition-colors"
              />
            </div>
          </div>

          {/* Export Button */}
          <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-6">
            <h3 className="text-base font-semibold text-[#fffffe] mb-4">Export Data</h3>
            <button
              onClick={handleExportExcel}
              disabled={isExporting || isLoading || Boolean(error) || filteredTransactions.length === 0}
              className={`${exportActionButtonClass} w-full`}
            >
              <FileSpreadsheet className={`w-4 h-4 ${exportActionIconClass}`} />
              {isExporting ? 'Exporting...' : 'Export to Excel'}
            </button>
            <p className="text-xs text-[#94a1b2] mt-3 text-center">
              Download {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Filters Box */}
          <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-6">
            <h3 className="text-base font-semibold text-[#fffffe] mb-4">Filters</h3>
            
            <div className="space-y-4">
              {/* Date From */}
              <div>
                <label className="block text-xs font-medium text-[#94a1b2] mb-2">From Date</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full px-3 py-2 bg-[#242629] border border-[#2e2f33] rounded-lg text-[#fffffe] text-sm focus:outline-none focus:border-[#7f5af0] transition-colors cursor-pointer"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-xs font-medium text-[#94a1b2] mb-2">To Date</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full px-3 py-2 bg-[#242629] border border-[#2e2f33] rounded-lg text-[#fffffe] text-sm focus:outline-none focus:border-[#7f5af0] transition-colors cursor-pointer"
                />
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-xs font-medium text-[#94a1b2] mb-2">Transaction Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="w-full px-3 py-2 bg-[#242629] border border-[#2e2f33] rounded-lg text-[#fffffe] text-sm focus:outline-none focus:border-[#7f5af0] transition-colors cursor-pointer"
                >
                  <option value="">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              {/* Reset Button */}
              <button
                onClick={handleResetFilters}
                className={`${resetFilterButtonClass} w-full`}
              >
                Reset Filters
              </button>
            </div>
          </div>

         

        </div>
      </div>

    </div>
  );
};

export default SocietyFinancesPage;
