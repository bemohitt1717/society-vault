import { Search } from 'lucide-react';
import AuditTable from '../components/AuditTable';
import { actionTypes, modules } from '../data/mockAuditData';
import useAuditLogsPage from '../hooks/useAuditLogsPage';
import {
  adminFormFieldClass,
  filterActionButtonClass,
} from '../../../../components/ui/actionButtonStyles';

const AuditLogsPage = () => {
  const { filters, setFilters, filteredLogs, clearFilters } = useAuditLogsPage();

  return (
    <div className="space-y-4">
      {/* Table + Filters Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Table - Left Side */}
        <div className="xl:col-span-9">
          <AuditTable logs={filteredLogs} />
        </div>

        {/* Search & Filters - Right Side */}
        <div className="xl:col-span-3">
          <div className="sticky top-4 space-y-4 rounded-xl border border-[#303136] bg-[#1a1a1e] p-4">
            {/* Search */}
            <div>
              <label className="block text-xs font-semibold text-[#fffffe] uppercase tracking-wider mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a1b2]" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className={`${adminFormFieldClass} pl-10 pr-3`}
                />
              </div>
            </div>

            {/* Filters Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-[#fffffe] uppercase tracking-wider">Filters</label>
                <button
                  onClick={clearFilters}
                  className={filterActionButtonClass}
                >
                  Clear
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#94a1b2] mb-1.5">Date From</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className={adminFormFieldClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#94a1b2] mb-1.5">Date To</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className={adminFormFieldClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#94a1b2] mb-1.5">User</label>
                  <input
                    type="text"
                    value={filters.user}
                    onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                    className={adminFormFieldClass}
                    placeholder="User name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#94a1b2] mb-1.5">Action</label>
                  <select
                    value={filters.action}
                    onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                    className={`${adminFormFieldClass} cursor-pointer`}
                  >
                    <option value="">All Actions</option>
                    {actionTypes.map((action) => (
                      <option key={action} value={action}>{action}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#94a1b2] mb-1.5">Module</label>
                  <select
                    value={filters.module}
                    onChange={(e) => setFilters({ ...filters, module: e.target.value })}
                    className={`${adminFormFieldClass} cursor-pointer`}
                  >
                    <option value="">All Modules</option>
                    {modules.map((module) => (
                      <option key={module} value={module}>{module}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogsPage;
