import { ArrowRight, CreditCard, FileText, TrendingUp, Wallet } from 'lucide-react';
import RecentPaymentsTable from '../components/RecentPaymentsTable';
import UpcomingMaintenanceCard from '../components/UpcomingMaintenanceCard';
import useResidentDashboard from '../hooks/useResidentDashboard';
import LoadingState from '../../../components/ui/LoadingState';

const ResidentDashboard = () => {
  const { stats, recentPayments, maintenance, isLoading, error, reload, viewAllPayments } = useResidentDashboard();

  if (isLoading) return <LoadingState fullPage label="Loading your dashboard..." />;

  return (
    <div className="space-y-6">
      {error && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#8b4545] bg-[#2a1c1c] px-4 py-3 text-sm text-[#f1b3b3]">
          <span>{error}</span>
          <button type="button" onClick={reload} className="rounded-md border border-[#a45a5a] px-3 py-1.5 font-medium text-white hover:bg-[#402525]">
            Retry
          </button>
        </div>
      )}
      {!error && (
        <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 md:gap-6">
        <div className="min-w-0 rounded-xl border border-[#26262b] bg-[#1a1a1e] p-2.5 transition-colors duration-200 hover:border-[#35363b] md:p-4">
          <div className="space-y-1 md:space-y-2">
            <h2 className="truncate text-lg font-bold leading-none tracking-tight text-[#ff6b6b] md:text-2xl">
              ₹{stats.myDueAmount.toLocaleString()}
            </h2>
            <p className="truncate text-[10px] font-medium text-[#aeb4bf] md:text-xs" title="My Due Amount">
              My Due Amount
            </p>
          </div>
          <div className="mt-2 flex items-center gap-1 md:mt-3 md:gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ff6b6b]/15 md:h-6 md:w-6">
              <Wallet aria-hidden="true" className="h-3 w-3 text-[#ff6b6b]" strokeWidth={2.5} />
            </span>
            <span className="text-[10px] font-semibold text-[#ff6b6b] md:text-xs">Pending</span>
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-[#26262b] bg-[#1a1a1e] p-2.5 transition-colors duration-200 hover:border-[#35363b] md:p-4">
          <div className="space-y-1 md:space-y-2">
            <h2 className="truncate text-lg font-bold leading-none tracking-tight text-[#fffffe] md:text-2xl">
              ₹{stats.paidThisMonth.toLocaleString()}
            </h2>
            <p className="truncate text-[10px] font-medium text-[#aeb4bf] md:text-xs" title="Paid This Month">
              Paid This Month
            </p>
          </div>
          <div className="mt-2 flex items-center gap-1 md:mt-3 md:gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2cb67d]/15 md:h-6 md:w-6">
              <CreditCard aria-hidden="true" className="h-3 w-3 text-[#2cb67d]" strokeWidth={2.5} />
            </span>
            <span className="text-[10px] font-semibold text-[#2cb67d] md:text-xs">This month</span>
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-[#26262b] bg-[#1a1a1e] p-2.5 transition-colors duration-200 hover:border-[#35363b] md:p-4">
          <div className="space-y-1 md:space-y-2">
            <h2 className="truncate text-lg font-bold leading-none tracking-tight text-[#fffffe] md:text-2xl">
              ₹{stats.totalPaidYear.toLocaleString()}
            </h2>
            <p className="truncate text-[10px] font-medium text-[#aeb4bf] md:text-xs" title="Total Paid (Year)">
              Total Paid (Year)
            </p>
          </div>
          <div className="mt-2 flex items-center gap-1 md:mt-3 md:gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7f5af0]/15 md:h-6 md:w-6">
              <TrendingUp aria-hidden="true" className="h-3 w-3 text-[#7f5af0]" strokeWidth={2.5} />
            </span>
            <span className="text-[10px] font-semibold text-[#2cb67d] md:text-xs">Year to date</span>
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-[#26262b] bg-[#1a1a1e] p-2.5 transition-colors duration-200 hover:border-[#35363b] md:p-4">
          <div className="space-y-1 md:space-y-2">
            <h2 className="truncate text-lg font-bold leading-none tracking-tight text-[#fffffe] md:text-2xl">
              {stats.pendingReceipts}
            </h2>
            <p className="truncate text-[10px] font-medium text-[#aeb4bf] md:text-xs" title="Receipts Available">
              Receipts Available
            </p>
          </div>
          <div className="mt-2 flex items-center gap-1 md:mt-3 md:gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ffa500]/15 md:h-6 md:w-6">
              <FileText aria-hidden="true" className="h-3 w-3 text-[#ffa500]" strokeWidth={2.5} />
            </span>
            <span className="text-[10px] font-semibold text-[#94a1b2] md:text-xs">Completed payments</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-7">
          <RecentPaymentsTable payments={recentPayments} />

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={viewAllPayments}
              className="group inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#3b3d42] bg-[#242629] px-4 py-2 text-sm font-medium text-[#f4f4f5] transition-colors duration-200 hover:border-[#55575e] hover:bg-[#2b2d31] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa] active:scale-[0.99] cursor-pointer"
            >
              View all payments
              <ArrowRight aria-hidden="true" className="h-4 w-4 text-[#a78bfa] transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        <aside className="min-w-0 xl:col-span-5" aria-label="Upcoming maintenance">
          <UpcomingMaintenanceCard maintenanceList={maintenance} />
        </aside>
      </div>
        </>
      )}
    </div>
  );
};

export default ResidentDashboard;
