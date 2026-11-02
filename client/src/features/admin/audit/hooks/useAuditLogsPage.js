import { useEffect, useMemo, useState } from 'react';
import { listAuditLogs } from '../../../../services/api/adminApi';
import { getApiErrorMessage } from '../../../../services/api/http';

const initialFilters = {
  search: '',
  dateFrom: '',
  dateTo: '',
  user: '',
  action: '',
  module: '',
};

const displayAction = (action) => {
  const knownActions = {
    created: 'Created',
    updated: 'Updated',
    disabled: 'Disabled',
    deleted: 'Deleted',
    recorded: 'Recorded',
    status_updated: 'Status Updated',
  };
  return knownActions[action] || action;
};

const displayEntity = (entity) => entity
  .split('_')
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join(' ');

const useAuditLogsPage = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const fetchLogs = async () => {
      const first = await listAuditLogs({ page: 1, limit: 100 });
      const remainingPages = first.meta?.pages > 1
        ? await Promise.all(
          Array.from({ length: first.meta.pages - 1 }, (_, index) => listAuditLogs({ page: index + 2, limit: 100 })),
        )
        : [];
      const records = [...first.data, ...remainingPages.flatMap((result) => result.data)];
      if (active) {
        setLogs(records.map((log) => ({
          ...log,
          id: log._id,
          timestamp: log.occurredAt,
          user: log.actor?.profile?.name || log.actor?.email || 'System',
          action: displayAction(log.action),
          module: displayEntity(log.entity),
          record: log.entityId,
          description: log.summary,
        })));
      }
    };

    fetchLogs()
      .catch((requestError) => {
        if (active) setError(getApiErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, []);

  const filteredLogs = useMemo(() => {
    let result = [...logs];
    if (filters.search.trim()) {
      const search = filters.search.toLowerCase();
      result = result.filter((log) => (
        log.description?.toLowerCase().includes(search)
        || log.id?.toLowerCase().includes(search)
        || log.user?.toLowerCase().includes(search)
        || log.record?.toLowerCase().includes(search)
        || log.action?.toLowerCase().includes(search)
        || log.module?.toLowerCase().includes(search)
      ));
    }
    if (filters.dateFrom) result = result.filter((log) => new Date(log.timestamp) >= new Date(filters.dateFrom));
    if (filters.dateTo) {
      const toDate = new Date(`${filters.dateTo}T23:59:59.999`);
      result = result.filter((log) => new Date(log.timestamp) <= toDate);
    }
    if (filters.user.trim()) {
      const user = filters.user.toLowerCase();
      result = result.filter((log) => log.user?.toLowerCase().includes(user));
    }
    if (filters.action) result = result.filter((log) => log.action === filters.action);
    if (filters.module) result = result.filter((log) => log.module === filters.module);
    return result;
  }, [filters, logs]);

  return {
    filters,
    setFilters,
    filteredLogs,
    actionTypes: [...new Set(logs.map((log) => log.action))].sort(),
    modules: [...new Set(logs.map((log) => log.module))].sort(),
    isLoading,
    error,
    clearFilters: () => setFilters(initialFilters),
  };
};

export default useAuditLogsPage;
