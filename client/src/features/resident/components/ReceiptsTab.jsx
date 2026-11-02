import { Search, Download, FileText, Calendar } from 'lucide-react';
import { compactDownloadButtonClass, exportActionButtonClass, exportActionIconClass } from '../../../components/ui/actionButtonStyles';
import useReceiptsTab from '../hooks/useReceiptsTab';

const ReceiptsTab = ({ receipts, profile }) => {
  const {
    searchTerm,
    setSearchTerm,
    isExporting,
    filteredReceipts,
    handleDownloadReceipt,
    handleDownloadAll,
  } = useReceiptsTab(receipts, profile);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (!receipts || receipts.length === 0) {
    return (
      <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#94a1b2]/15 flex items-center justify-center">
          <FileText className="w-8 h-8 text-[#94a1b2]" />
        </div>
        <h3 className="text-lg font-semibold text-[#fffffe] mb-2">No Receipts Available</h3>
        <p className="text-sm text-[#94a1b2]">
          Receipts will appear here after successful payments.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT: Receipts Grid (70% width on desktop) */}
      <div className="lg:col-span-8">
        {filteredReceipts.length === 0 ? (
          <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-8 text-center">
            <Search className="w-12 h-12 mx-auto mb-4 text-[#94a1b2]" />
            <h3 className="text-lg font-semibold text-[#fffffe] mb-2">No Receipts Found</h3>
            <p className="text-sm text-[#94a1b2]">
              Try adjusting your search terms.
            </p>
          </div>
        ) : (
          <>
                       
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredReceipts.map((receipt) => (
                <article
                  key={receipt.id}
                  className="rounded-xl border border-[#303136] bg-[#1a1a1e] p-4 transition-colors duration-200 hover:border-[#4a4b51]"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="min-w-0 truncate text-sm font-semibold text-white">
                      {receipt.id}
                    </h3>
                    <span className="shrink-0 text-base font-semibold tabular-nums text-white">
                      ₹{receipt.amount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="mt-1 flex min-w-0 items-center gap-2 text-sm text-[#d0d3d9]">
                    <span className="truncate">{receipt.category}</span>
                    <span aria-hidden="true" className="text-[#777b84]">/</span>
                    <span className="truncate text-[#aeb4bf]">{receipt.month}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#b8bec8]">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar aria-hidden="true" className="h-3.5 w-3.5 text-[#aeb4bf]" />
                      {formatDate(receipt.date)}
                    </span>
                    <span>{receipt.paymentMode}</span>
                    <span className="text-[#8f959f]">{receipt.status === 'generated' ? 'Paid' : receipt.status}</span>
                  </div>

                  <button
                    onClick={() => handleDownloadReceipt(receipt)}
                    disabled={isExporting}
                    className={`${compactDownloadButtonClass} mt-3 min-h-9 w-full py-2 text-sm`}
                  >
                    <Download aria-hidden="true" className={`h-4 w-4 ${exportActionIconClass}`} />
                    {isExporting ? 'Generating...' : 'Download receipt'}
                  </button>
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      {/* RIGHT: Search & Actions (30% width on desktop) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Search Box */}
        <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-6">
          <h3 className="text-base font-semibold text-[#fffffe] mb-4">Search Receipts</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a1b2]" />
            <input
              type="text"
              placeholder="Search receipts..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="w-full pl-11 pr-4 py-3 bg-[#242629] border border-[#2e2f33] rounded-lg text-[#fffffe] placeholder-[#94a1b2] focus:outline-none focus:border-[#7f5af0] transition-colors"
            />
          </div>
        </div>

        {/* Download All Box */}
        <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-6">
          <h3 className="text-base font-semibold text-[#fffffe] mb-4">Bulk Actions</h3>
          <button
            onClick={handleDownloadAll}
            disabled={isExporting}
            className={`${exportActionButtonClass} w-full`}
          >
            <Download className={`w-4 h-4 ${exportActionIconClass}`} />
            {isExporting ? 'Generating...' : 'Download All Receipts'}
          </button>
          <p className="text-xs text-[#94a1b2] mt-3">
            Download all {receipts.length} receipts as individual PDFs
          </p>
        </div>

      </div>

    </div>
  );
};

export default ReceiptsTab;
