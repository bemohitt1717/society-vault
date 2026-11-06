import DuesTab from '../components/DuesTab';
import PaymentHistoryTab from '../components/PaymentHistoryTab';
import ReceiptsTab from '../components/ReceiptsTab';
import useMyPaymentsPage from '../hooks/useMyPaymentsPage';
import LoadingState from '../../../components/ui/LoadingState';

const MyPaymentsPage = () => {
  const {
    activeTab,
    setActiveTab,
    dues,
    payments,
    receipts,
    profile,
    tabs,
    payNow,
    isLoading,
    isSubmitting,
    error,
    message,
    reload,
  } = useMyPaymentsPage();

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
      {message && (
        <p role="status" className="rounded-lg border border-[#3d795e] bg-[#1b2b23] px-4 py-3 text-sm text-[#a8e0c1]">
          {message}
        </p>
      )}

      {/* Tab Navigation */}
      <nav aria-label="Payment sections" className="rounded-xl border border-[#303136] bg-[#1a1a1e] p-1.5">
        <div className="grid grid-cols-3 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-w-0 items-center justify-center gap-1.5 rounded-lg border px-2 py-2.5 text-xs font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa] cursor-pointer sm:gap-2 sm:px-3 sm:py-3 sm:text-sm ${
                  isActive
                    ? 'border-[#45414f] bg-[#28262e] text-[#f4f4f5]'
                    : 'border-transparent text-[#aeb4bf] hover:bg-[#242629] hover:text-[#f4f4f5]'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#a78bfa]' : 'text-[#8f949e]'}`} strokeWidth={2} />
                <span className="hidden truncate sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
                {tab.count > 0 && (
                  <span
                    className="rounded-md bg-[#242629] px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-[#b8bec8] sm:px-2 sm:text-xs"
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Tab Content */}
      <div>
        {isLoading || error ? (
          <div className="rounded-xl border border-[#303136] bg-[#1a1a1e] px-6 py-10 text-center text-sm text-[#aeb4bf]">
            {isLoading
              ? <LoadingState label="Loading your payment details..." className="min-h-16" />
              : 'Payment data is unavailable until the request succeeds.'}
          </div>
        ) : (
          <>
        {activeTab === 'dues' && (
          <DuesTab dues={dues} onPayNow={payNow} isSubmitting={isSubmitting} />
        )}
        
        {activeTab === 'history' && (
          <PaymentHistoryTab payments={payments} profile={profile} />
        )}
        
        {activeTab === 'receipts' && (
          <ReceiptsTab receipts={receipts} profile={profile} />
        )}
          </>
        )}
      </div>

    </div>
  );
};

export default MyPaymentsPage;
