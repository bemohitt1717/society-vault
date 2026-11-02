
import { Search, Filter, Download, FileSpreadsheet, CheckCircle, Clock, XCircle } from 'lucide-react';
import { compactDownloadButtonClass, exportActionButtonClass, exportActionIconClass, resetFilterButtonClass } from '../../../components/ui/actionButtonStyles';
import usePaymentHistoryTab from '../hooks/usePaymentHistoryTab';

const getStatusIcon = (status) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-[#2cb67d]" />;
    case 'pending':
      return <Clock className="w-4 h-4 text-[#ffa500]" />;
    case 'failed':
      return <XCircle className="w-4 h-4 text-[#ff6b6b]" />;
    default:
      return <Clock className="w-4 h-4 text-[#94a1b2]" />;
  }
};

const PaymentHistoryTab = ({ payments, profile }) => {
  const { filters, setFilters, isExporting, filteredPayments, categories, handleResetFilters, handleExportPDF, handleDownloadReceipt, formatDate, handleExportExcel } = usePaymentHistoryTab({ payments, profile });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT: Payment History Table (70% width on desktop) */}
      <div className="lg:col-span-8">
        {filteredPayments.length === 0 ? (
          <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-8 text-center">
            <Filter className="w-12 h-12 mx-auto mb-4 text-[#94a1b2]" />
            <h3 className="text-lg font-semibold text-[#fffffe] mb-2">No Payments Found</h3>
            <p className="text-sm text-[#94a1b2]">
              Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <section className="overflow-hidden rounded-xl border border-[#303136] bg-[#1a1a1e]" aria-labelledby="payment-history-heading">
            <div className="flex items-center justify-between gap-3 border-b border-[#303136] px-4 py-3.5 sm:px-5">
              <div>
                <h2 id="payment-history-heading" className="text-base font-semibold text-[#f4f4f5]">Payment history</h2>
                <p className="mt-1 text-xs text-[#aeb4bf]">Completed payments and available receipts</p>
              </div>
              <span className="shrink-0 text-xs tabular-nums text-[#aeb4bf]">
                {filteredPayments.length} {filteredPayments.length === 1 ? 'payment' : 'payments'}
              </span>
            </div>
            
            <div className="hidden overflow-x-auto xl:block">
              <table aria-label="Payment history" className="w-full min-w-[620px]">
                <thead className="bg-[#202124]">
                  <tr className="border-b border-[#303136]">
                    <th scope="col" className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wide text-[#aeb4bf] sm:px-5">
                      Date
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wide text-[#aeb4bf] sm:px-5">
                      Category
                    </th>
                    <th scope="col" className="hidden px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wide text-[#aeb4bf] lg:table-cell">
                      Payment Mode
                    </th>
                    <th scope="col" className="hidden px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wide text-[#aeb4bf] md:table-cell">
                      Transaction ID
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-wide text-[#aeb4bf] sm:px-5">
                      Amount
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-[11px] font-medium uppercase tracking-wide text-[#aeb4bf] sm:px-5">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-[11px] font-medium uppercase tracking-wide text-[#aeb4bf] sm:px-5">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2b2d31]">
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="transition-colors duration-150 hover:bg-[#202124]"
                    >
                      {/* Date */}
                      <td className="whitespace-nowrap px-4 py-3.5 sm:px-5">
                        <div className="text-sm font-medium text-[#f4f4f5]">
                          {formatDate(payment.date)}
                        </div>
                        <div className="mt-0.5 text-xs text-[#aeb4bf]">{payment.month}</div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5 sm:px-5">
                        <span className="text-sm font-medium text-[#e4e4e7]">{payment.category}</span>
                      </td>

                      {/* Payment Mode */}
                      <td className="hidden whitespace-nowrap px-4 py-3.5 text-sm text-[#b8bec8] lg:table-cell">
                        {payment.paymentMode}
                      </td>

                      {/* Transaction ID */}
                      <td className="hidden px-4 py-3.5 md:table-cell">
                        <span className="text-xs tabular-nums text-[#aeb4bf]">
                          {payment.transactionId || 'N/A'}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="whitespace-nowrap px-4 py-3.5 text-right sm:px-5">
                        <span className="text-sm font-semibold tabular-nums text-[#f4f4f5]">
                          ₹{payment.amount.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 text-center sm:px-5">
                        <div className="flex items-center justify-center gap-1.5">
                          {getStatusIcon(payment.status)}
                          <span className={`hidden text-xs font-medium capitalize md:inline ${
                            payment.status === 'completed' ? 'text-[#82cba6]' :
                            payment.status === 'failed' ? 'text-[#e69a9a]' :
                            payment.status === 'processing' ? 'text-[#b9a6f5]' : 'text-[#e4bd7b]'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-center sm:px-5">
                        {payment.receiptNo && (
                          <button
                            onClick={() => handleDownloadReceipt(payment)}
                            disabled={isExporting}
                            className={compactDownloadButtonClass}
                            title="Download Receipt"
                          >
                            <Download aria-hidden="true" className={`h-3.5 w-3.5 ${exportActionIconClass}`} />
                            <span className="hidden sm:inline">Receipt</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="divide-y divide-[#2b2d31] xl:hidden">
              {filteredPayments.map((payment) => (
                <article key={payment.id} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#f4f4f5]">{payment.category}</p>
                      <p className="mt-1 text-xs text-[#aeb4bf]">
                        {formatDate(payment.date)} <span aria-hidden="true">/</span> {payment.month}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold tabular-nums text-[#f4f4f5]">
                      ₹{payment.amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <p className="mt-2 truncate text-xs text-[#aeb4bf]">
                    {payment.paymentMode}
                    <span aria-hidden="true" className="mx-1.5 text-[#686b73]">/</span>
                    {payment.transactionId || 'No transaction ID'}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium capitalize">
                      {getStatusIcon(payment.status)}
                      <span className={
                        payment.status === 'completed' ? 'text-[#82cba6]' :
                        payment.status === 'failed' ? 'text-[#e69a9a]' :
                        payment.status === 'processing' ? 'text-[#b9a6f5]' : 'text-[#e4bd7b]'
                      }>
                        {payment.status}
                      </span>
                    </span>
                    {payment.receiptNo && (
                      <button
                        type="button"
                        onClick={() => handleDownloadReceipt(payment)}
                        disabled={isExporting}
                        className={compactDownloadButtonClass}
                        title="Download Receipt"
                      >
                        <Download aria-hidden="true" className={`h-3.5 w-3.5 ${exportActionIconClass}`} />
                        Receipt
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* RIGHT: Search & Filters (30% width on desktop) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Search Box */}
        <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-6">
          <h3 className="text-base font-semibold text-[#fffffe] mb-4">Search</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a1b2]" />
            <input
              type="text"
              placeholder="Search payments..."
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
          <div className="space-y-3">
            <button
              onClick={handleExportPDF}
              disabled={isExporting || filteredPayments.length === 0}
              className={`${exportActionButtonClass} w-full`}
            >
              <Download className={`w-4 h-4 ${exportActionIconClass}`} />
              {isExporting ? 'Exporting...' : 'Export to PDF'}
            </button>
          <button
            onClick={handleExportExcel}
            disabled={isExporting || filteredPayments.length === 0}
            className={`${exportActionButtonClass} w-full`}
          >
            <FileSpreadsheet className={`w-4 h-4 ${exportActionIconClass}`} />
            {isExporting ? 'Exporting...' : 'Export to Excel'}
          </button>
          </div>
          <p className="text-xs text-[#94a1b2] mt-3 text-center">
            Download {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''}
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

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-[#94a1b2] mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 bg-[#242629] border border-[#2e2f33] rounded-lg text-[#fffffe] text-sm focus:outline-none focus:border-[#7f5af0] transition-colors cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-[#94a1b2] mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 bg-[#242629] border border-[#2e2f33] rounded-lg text-[#fffffe] text-sm focus:outline-none focus:border-[#7f5af0] transition-colors cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="processing">Processing</option>
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
  );
};

export default PaymentHistoryTab;
