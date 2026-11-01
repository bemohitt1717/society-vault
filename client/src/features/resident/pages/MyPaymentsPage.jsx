import DuesTab from '../components/DuesTab';
import PaymentHistoryTab from '../components/PaymentHistoryTab';
import ReceiptsTab from '../components/ReceiptsTab';
import useMyPaymentsPage from '../hooks/useMyPaymentsPage';

const MyPaymentsPage = () => {
  const { activeTab, setActiveTab, dues, payments, receipts, tabs, payNow } = useMyPaymentsPage();

  return (
    <div className="space-y-6">
      
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
        {activeTab === 'dues' && (
          <DuesTab dues={dues} onPayNow={payNow} />
        )}
        
        {activeTab === 'history' && (
          <PaymentHistoryTab payments={payments} />
        )}
        
        {activeTab === 'receipts' && (
          <ReceiptsTab receipts={receipts} />
        )}
      </div>

    </div>
  );
};

export default MyPaymentsPage;
