import { Eye, Edit2 } from 'lucide-react';
import { format } from 'date-fns';

const IncomeTable = ({ transactions, onEdit, onView, isLoading, page, total, totalPages, onPageChange }) => {
  return (
    <div className="bg-[#1a1a1e] border border-[#26262b] rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#26262b]">
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Date</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Transaction ID</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Description</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Category</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Resident/Flat</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Payment Mode</th>
              <th className="px-4 py-3.5 text-right text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3.5 text-center text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#26262b]">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-[#94a1b2]">{isLoading ? 'Loading transactions...' : 'No transactions found'}</p>
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
                <td className="px-4 py-3.5 text-sm text-[#fffffe]">
                  <div className="flex flex-col">
                    <span>{transaction.resident}</span>
                    <span className="text-xs text-[#94a1b2]">{transaction.flat}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-sm text-[#94a1b2]">{transaction.paymentMode}</td>
                <td className="px-4 py-3.5 text-right">
                  <span className="text-sm font-medium text-[#8db5a2]">
                    ₹{transaction.amount.toLocaleString()}
                  </span>
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
          <span className="font-medium text-[#fffffe]">{total}</span> {total === 1 ? 'transaction' : 'transactions'}
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

export default IncomeTable;
