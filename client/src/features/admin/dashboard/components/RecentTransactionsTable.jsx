import { ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import Card from '../../../../components/ui/Card';

const RecentTransactionsTable = ({ transactions }) => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#fffffe]">Recent Transactions</h3>
          <p className="text-sm text-[#94a1b2] mt-1">Latest 5 transactions</p>
        </div>
        <button className="flex items-center gap-2 text-sm text-[#b7acef] hover:text-[#d0c8f4] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b7acef]">
          View All
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2e2f33]">
              <th className="text-left text-xs font-medium text-[#94a1b2] pb-3 px-2">Date</th>
              <th className="text-left text-xs font-medium text-[#94a1b2] pb-3 px-2">Description</th>
              <th className="text-left text-xs font-medium text-[#94a1b2] pb-3 px-2">Category</th>
              <th className="text-left text-xs font-medium text-[#94a1b2] pb-3 px-2">Type</th>
              <th className="text-right text-xs font-medium text-[#94a1b2] pb-3 px-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr 
                key={index}
                className="border-b border-[#2e2f33]/50 hover:bg-[#242629]/50 transition-colors"
              >
                <td className="py-4 px-2">
                  <p className="text-sm text-[#fffffe]">
                    {format(new Date(transaction.date), 'MMM dd')}
                  </p>
                  <p className="text-xs text-[#72757e]">
                    {format(new Date(transaction.date), 'yyyy')}
                  </p>
                </td>
                <td className="py-4 px-2">
                  <p className="text-sm text-[#fffffe] font-medium">{transaction.description}</p>
                </td>
                <td className="py-4 px-2 text-sm text-[#b8bec8]">{transaction.category}</td>
                <td className="py-4 px-2">
                  <div className="flex items-center gap-1.5">
                    {transaction.type === 'income' ? (
                      <>
                        <ArrowUpRight className="w-4 h-4 text-[#8db5a2]" />
                        <span className="text-sm text-[#8db5a2] font-medium">Income</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownRight className="w-4 h-4 text-[#c99393]" />
                        <span className="text-sm text-[#c99393] font-medium">Expense</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="py-4 px-2 text-right">
                  <p className={`text-sm font-semibold ${
                    transaction.type === 'income' ? 'text-[#8db5a2]' : 'text-[#c99393]'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecentTransactionsTable;
