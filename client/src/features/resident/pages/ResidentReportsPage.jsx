
import { Download, FileText, Calendar } from 'lucide-react';
import { exportActionButtonClass, exportActionIconClass, resetFilterButtonClass } from '../../../components/ui/actionButtonStyles';
import useResidentReportsPage from '../hooks/useResidentReportsPage';

const ResidentReportsPage = () => {
  const {
    filters,
    setFilters,
    isExporting,
    reportTypes,
    payments,
    receipts,
    reportSummary,
    isLoading,
    error,
    reload,
    handleDownloadReport,
    handleResetFilters,
  } = useResidentReportsPage();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-12 space-y-3">
        {isLoading && (
          <p role="status" className="rounded-lg border border-[#45414f] bg-[#1a1a1e] px-4 py-3 text-sm text-[#d0d3d9]">
            Loading your report data…
          </p>
        )}
        {error && (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#8b4545] bg-[#2a1c1c] px-4 py-3 text-sm text-[#f1b3b3]">
            {error}
            <button type="button" onClick={reload} className="rounded-md border border-[#a45a5a] px-3 py-1.5 font-medium text-white hover:bg-[#402525]">
              Retry
            </button>
          </div>
        )}
      </div>
      
      {/* LEFT: Report Preview/Info (70% width) */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Report Info Card */}
        <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#7f5af0]/15 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-[#7f5af0]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#fffffe] mb-2">Generate Reports & Statements</h3>
              <p className="text-sm text-[#c5cad3]">
                Download your payment statements, yearly summaries, and receipts in PDF or Excel format.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-[#242629] border border-[#2e2f33]">
              <p className="text-xs text-[#c5cad3] mb-1">Total Paid (selected period)</p>
              <p className="text-xl font-bold text-[#fffffe]">{isLoading || error ? '—' : `₹${Number(reportSummary.totalPaid || 0).toLocaleString('en-IN')}`}</p>
            </div>
            <div className="p-4 rounded-lg bg-[#242629] border border-[#2e2f33]">
              <p className="text-xs text-[#c5cad3] mb-1">Total Payments</p>
              <p className="text-xl font-bold text-[#fffffe]">{isLoading || error ? '—' : payments.length}</p>
            </div>
            <div className="p-4 rounded-lg bg-[#242629] border border-[#2e2f33]">
              <p className="text-xs text-[#c5cad3] mb-1">Receipts Generated</p>
              <p className="text-xl font-bold text-[#fffffe]">{isLoading || error ? '—' : receipts.length}</p>
            </div>
          </div>
        </div>

        {/* Available Reports */}
        <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#26262b]">
            <h3 className="text-lg font-semibold text-[#fffffe]">Available Reports</h3>
            <p className="text-xs text-[#c5cad3] mt-1">Choose a report to set it in Report Options</p>
          </div>

          <div className="p-6 space-y-3">
            {/* Payment Statement */}
            <button type="button" aria-pressed={filters.reportType === 'payment'} onClick={() => setFilters({ ...filters, reportType: 'payment' })} className={`group w-full flex cursor-pointer items-center justify-between p-5 rounded-xl border text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${filters.reportType === 'payment' ? 'bg-[#2d2e33] border-[#858993]' : 'bg-[#242629] border-[#36383d] hover:border-[#858993]'}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#7f5af0]/10 flex items-center justify-center group-hover:bg-[#7f5af0]/20 transition-all">
                  <FileText className="w-6 h-6 text-[#7f5af0]" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-[#fffffe] mb-1">Payment Statement</h4>
                  <p className="text-sm text-[#d0d3d9]">Detailed payment history with dates</p>
                </div>
              </div>
              <span className="text-sm font-medium text-white">{filters.reportType === 'payment' ? 'Selected' : 'Select'}</span>
            </button>

            {/* Yearly Summary */}
            <button type="button" aria-pressed={filters.reportType === 'yearly'} onClick={() => setFilters({ ...filters, reportType: 'yearly' })} className={`group w-full flex cursor-pointer items-center justify-between p-5 rounded-xl border text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${filters.reportType === 'yearly' ? 'bg-[#2d2e33] border-[#858993]' : 'bg-[#242629] border-[#36383d] hover:border-[#858993]'}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#7f5af0]/10 flex items-center justify-center group-hover:bg-[#7f5af0]/20 transition-all">
                  <Calendar className="w-6 h-6 text-[#7f5af0]" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-[#fffffe] mb-1">Yearly Summary</h4>
                  <p className="text-sm text-[#d0d3d9]">Complete year payment overview</p>
                </div>
              </div>
              <span className="text-sm font-medium text-white">{filters.reportType === 'yearly' ? 'Selected' : 'Select'}</span>
            </button>

            {/* All Receipts */}
            <button type="button" aria-pressed={filters.reportType === 'receipts'} onClick={() => setFilters({ ...filters, reportType: 'receipts' })} className={`group w-full flex cursor-pointer items-center justify-between p-5 rounded-xl border text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${filters.reportType === 'receipts' ? 'bg-[#2d2e33] border-[#858993]' : 'bg-[#242629] border-[#36383d] hover:border-[#858993]'}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#7f5af0]/10 flex items-center justify-center group-hover:bg-[#7f5af0]/20 transition-all">
                  <Download className="w-6 h-6 text-[#7f5af0]" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-[#fffffe] mb-1">All Receipts</h4>
                  <p className="text-sm text-[#d0d3d9]">Download all payment receipts</p>
                </div>
              </div>
              <span className="text-sm font-medium text-white">{filters.reportType === 'receipts' ? 'Selected' : `${receipts.length} available`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Filters & Download (30% width) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Filters Box */}
        <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-6">
          <h3 className="text-base font-semibold text-[#fffffe] mb-4">Report Options</h3>
          
          <div className="space-y-4">
            {/* Report Type */}
            <div>
              <label className="block text-xs font-medium text-[#94a1b2] mb-2">Report Type</label>
              <select
                value={filters.reportType}
                onChange={(e) => setFilters({ ...filters, reportType: e.target.value })}
                className="w-full px-3 py-2 bg-[#242629] border border-[#2e2f33] rounded-lg text-[#fffffe] text-sm focus:outline-none focus:border-[#7f5af0] transition-colors cursor-pointer"
              >
                {reportTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

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

            {/* Format */}
            <div>
              <label className="block text-xs font-medium text-[#94a1b2] mb-2">Format</label>
              <select
                value={filters.format}
                onChange={(e) => setFilters({ ...filters, format: e.target.value })}
                className="w-full px-3 py-2 bg-[#242629] border border-[#2e2f33] rounded-lg text-[#fffffe] text-sm focus:outline-none focus:border-[#7f5af0] transition-colors cursor-pointer"
              >
                <option value="pdf">PDF Document</option>
                <option value="excel">Excel Spreadsheet</option>
              </select>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownloadReport}
              disabled={isExporting || isLoading || Boolean(error)}
              className={`${exportActionButtonClass} w-full`}
            >
              <Download className={`w-4 h-4 ${exportActionIconClass}`} />
              {isExporting ? 'Generating...' : 'Download Report'}
            </button>

            {/* Reset Button */}
            <button
              onClick={handleResetFilters}
              className={`${resetFilterButtonClass} w-full`}
            >
              Reset Options
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResidentReportsPage;
