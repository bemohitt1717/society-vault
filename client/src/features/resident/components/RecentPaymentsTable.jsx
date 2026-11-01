import { CheckCircle, Clock, XCircle } from 'lucide-react';

const RecentPaymentsTable = ({ payments }) => {

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle aria-hidden="true" className="h-4 w-4 text-[#68c99d]" />;
      case 'pending':
        return <Clock aria-hidden="true" className="h-4 w-4 text-[#e4bd7b]" />;
      case 'failed':
        return <XCircle aria-hidden="true" className="h-4 w-4 text-[#e69a9a]" />;
      default:
        return <Clock aria-hidden="true" className="h-4 w-4 text-[#aeb4bf]" />;
    }
  };

  const getStatusColor = (status) => {
    if (status === 'completed') return 'text-[#82cba6]';
    if (status === 'failed') return 'text-[#e69a9a]';
    if (status === 'processing') return 'text-[#b9a6f5]';
    return 'text-[#e4bd7b]';
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  if (!payments || payments.length === 0) {
    return (
      <section className="overflow-hidden rounded-xl border border-[#303136] bg-[#1a1a1e]" aria-labelledby="recent-payments-title">
        <div className="border-b border-[#303136] px-4 py-3.5 sm:px-5">
          <h2 id="recent-payments-title" className="text-base font-semibold text-[#f4f4f5]">Recent payments</h2>
          <p className="mt-1 text-xs text-[#aeb4bf]">Your latest payment transactions</p>
        </div>
        <p className="px-4 py-10 text-center text-sm text-[#aeb4bf]">No recent payments found.</p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border border-[#303136] bg-[#1a1a1e]" aria-labelledby="recent-payments-title">
      <div className="flex items-center justify-between gap-3 border-b border-[#303136] px-4 py-3.5 sm:px-5">
        <div>
          <h2 id="recent-payments-title" className="text-base font-semibold text-[#f4f4f5]">Recent payments</h2>
          <p className="mt-1 text-xs text-[#aeb4bf]">Your latest payment transactions</p>
        </div>
        <span className="shrink-0 text-xs tabular-nums text-[#aeb4bf]">
          {payments.length} {payments.length === 1 ? 'payment' : 'payments'}
        </span>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[560px] text-left">
          <thead className="bg-[#202124]">
            <tr className="border-b border-[#303136]">
              <th scope="col" className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-[#aeb4bf] sm:px-5">Date</th>
              <th scope="col" className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-[#aeb4bf] sm:px-5">Category</th>
              <th scope="col" className="hidden px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-[#aeb4bf] lg:table-cell">Payment mode</th>
              <th scope="col" className="px-4 py-2.5 text-right text-[11px] font-medium uppercase tracking-wide text-[#aeb4bf] sm:px-5">Amount</th>
              <th scope="col" className="px-4 py-2.5 text-center text-[11px] font-medium uppercase tracking-wide text-[#aeb4bf] sm:px-5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2b2d31]">
            {payments.map((payment) => (
              <tr key={payment.id} className="transition-colors duration-150 hover:bg-[#202124]">
                <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                  <span className="text-sm font-medium text-[#f4f4f5]">{formatDate(payment.date)}</span>
                </td>
                <td className="px-4 py-3 sm:px-5">
                  <span className="block text-sm font-medium text-[#e4e4e7]">{payment.category}</span>
                  <span className="mt-0.5 block text-xs text-[#aeb4bf]">{payment.month}</span>
                </td>
                <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-[#b8bec8] lg:table-cell">
                  {payment.paymentMode}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right sm:px-5">
                  <span className="text-sm font-semibold tabular-nums text-[#f4f4f5]">
                    ₹{payment.amount.toLocaleString('en-IN')}
                  </span>
                </td>
                <td className="px-4 py-3 text-center sm:px-5">
                  <span className={`inline-flex items-center justify-center gap-1.5 text-xs font-medium capitalize ${getStatusColor(payment.status)}`}>
                    {getStatusIcon(payment.status)}
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-[#2b2d31] md:hidden">
        {payments.map((payment) => (
          <article key={payment.id} className="px-4 py-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-medium text-[#f4f4f5]">{payment.category}</h3>
                <p className="mt-0.5 text-xs text-[#aeb4bf]">{formatDate(payment.date)} / {payment.month}</p>
              </div>
              <p className="shrink-0 text-sm font-semibold tabular-nums text-[#f4f4f5]">
                ₹{payment.amount.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-xs text-[#aeb4bf]">{payment.paymentMode}</span>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium capitalize ${getStatusColor(payment.status)}`}>
                {getStatusIcon(payment.status)}
                {payment.status}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RecentPaymentsTable;
