import { Eye, Edit2, FileText, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const ExpenseTable = ({ transactions, onEdit, onView, isLoading, page, total, totalPages, onPageChange }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'text-[#8db5a2]';
      case 'Pending':
        return 'text-[#d2b88e]';
      case 'Overdue':
        return 'text-[#c99393]';
      case 'Cancelled':
        return 'text-[#aeb4bf]';
      default:
        return 'text-[#aeb4bf]';
    }
  };

  return (
    <div className="bg-[#1a1a1e] border border-[#26262b] rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#26262b]">
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Date</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Expense ID</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Description</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Category</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Vendor</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Status</th>
              <th className="px-4 py-3.5 text-right text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3.5 text-center text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Invoice</th>
              <th className="px-4 py-3.5 text-center text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#26262b]">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-[#94a1b2]">{isLoading ? 'Loading expenses...' : 'No expenses found'}</p>
                    {!isLoading && <p className="text-xs text-[#6b6b70]">Try adjusting your filters</p>}
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-[#1e1e22] transition-colors">
                <td className="px-4 py-3.5 text-sm text-[#fffffe]">
                  {format(new Date(transaction.date), 'MMM dd, yyyy')}
                </td>
                <td className="px-4 py-3.5 text-sm text-[#94a1b2] font-mono">{transaction.id}</td>
                <td className="px-4 py-3.5 text-sm text-[#fffffe] max-w-xs truncate">
                  {transaction.description}
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-sm text-[#b8bec8]">{transaction.category}</span>
                </td>
                <td className="px-4 py-3.5 text-sm text-[#fffffe] max-w-xs truncate">
                  {transaction.vendor}
                </td>
                <td className="px-4 py-3.5">
                  <span className={`text-sm font-medium ${getStatusColor(transaction.paymentStatus)}`}>
                    {transaction.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <span className="text-sm font-medium text-[#c99393]">
                    ₹{transaction.amount.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  {transaction.hasInvoice ? (
                    <FileText className="w-4 h-4 text-[#8db5a2] mx-auto" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#94a1b2] mx-auto opacity-30" />
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="p-1.5 hover:bg-[#242629] rounded-lg transition-colors cursor-pointer text-[#94a1b2] hover:text-[#fffffe]"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onView(transaction)}
                      className="p-1.5 hover:bg-[#242629] rounded-lg transition-colors cursor-pointer text-[#94a1b2] hover:text-[#fffffe]"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3.5 border-t border-[#26262b]">
        <p className="text-sm text-[#94a1b2]">
          Showing <span className="font-medium text-[#fffffe]">{total ? `${(page - 1) * 20 + 1}-${Math.min(page * 20, total)}` : '0'}</span> of{' '}
          <span className="font-medium text-[#fffffe]">{total}</span> {total === 1 ? 'expense' : 'expenses'}
        </p>
        <div className="flex gap-2">
          <button disabled={page <= 1 || isLoading} onClick={() => onPageChange(page - 1)} className="px-3 py-1.5 text-sm border border-[#3b3d42] hover:border-[#55575e] rounded-lg text-[#b8bec8] hover:text-[#f4f4f5] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
            Previous
          </button>
          <span className="px-3 py-1.5 text-sm text-[#fffffe]" aria-current="page">{page} / {totalPages}</span>
          <button disabled={page >= totalPages || isLoading} onClick={() => onPageChange(page + 1)} className="px-3 py-1.5 text-sm border border-[#3b3d42] hover:border-[#55575e] rounded-lg text-[#b8bec8] hover:text-[#f4f4f5] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTable;
