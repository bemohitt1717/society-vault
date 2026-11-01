import { useState } from 'react';
import { auditLogs } from '../data/mockAuditData';

const initialFilters = {
  search: '',
  dateFrom: '',
  dateTo: '',
  user: '',
  action: '',
  module: '',
};

const filterAuditLogs = (logs, filters) => {
  let filtered = [...logs];

  if (filters.search.trim()) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter((log) =>
      log.description?.toLowerCase().includes(search)
      || log.id?.toLowerCase().includes(search)
      || log.user?.toLowerCase().includes(search)
      || log.record?.toLowerCase().includes(search)
      || log.action?.toLowerCase().includes(search)
      || log.module?.toLowerCase().includes(search));
  }
  if (filters.dateFrom) {
    filtered = filtered.filter((log) => new Date(log.timestamp) >= new Date(filters.dateFrom));
  }
  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    toDate.setHours(23, 59, 59, 999);
    filtered = filtered.filter((log) => new Date(log.timestamp) <= toDate);
  }
  if (filters.user.trim()) {
    const user = filters.user.toLowerCase();
    filtered = filtered.filter((log) => log.user?.toLowerCase().includes(user));
  }
  if (filters.action) {
    filtered = filtered.filter((log) => log.action === filters.action);
  }
  if (filters.module) {
    filtered = filtered.filter((log) => log.module === filters.module);
  }

  return filtered;
};

const useAuditLogsPage = () => {
  const [filters, setFilters] = useState(initialFilters);
  return {
    filters,
    setFilters,
    filteredLogs: filterAuditLogs(auditLogs, filters),
    clearFilters: () => setFilters(initialFilters),
  };
};

export default useAuditLogsPage;
