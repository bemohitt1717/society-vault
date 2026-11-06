import { useCallback, useEffect, useState } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { createIncome, deleteIncome, getSettings, listAllResidents, listIncome, updateIncome } from '../../../../services/api/adminApi';
import { getApiErrorMessage } from '../../../../services/api/http';

const initialFilters = {
  search: '',
  dateFrom: '',
  dateTo: '',
  category: '',
  paymentMode: '',
};

const emptyStats = { totalIncome: 0, transactionCount: 0, averageAmount: 0 };
const pageSize = 20;

const useIncomePage = () => {
  const location = useLocation();
  const outletContext = useOutletContext();
  const triggerAddIncome = outletContext?.triggerAddIncome || 0;
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [viewingIncome, setViewingIncome] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(emptyStats);
  const [categories, setCategories] = useState([]);
  const [residents, setResidents] = useState([]);
  const [residentsLoading, setResidentsLoading] = useState(true);
  const [residentsError, setResidentsError] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [actionError, setActionError] = useState('');
  const [reloadVersion, setReloadVersion] = useState(0);
  const [residentsReloadVersion, setResidentsReloadVersion] = useState(0);
  const [settingsReloadVersion, setSettingsReloadVersion] = useState(0);

  const handleAddIncome = useCallback(() => {
    setActionError('');
    setEditingIncome(null);
    setShowForm(true);
  }, []);

  const handleEditIncome = useCallback((income) => {
    setActionError('');
    setEditingIncome(income);
    setShowForm(true);
  }, []);

  const handleViewIncome = useCallback((income) => {
    setActionError('');
    setViewingIncome(income);
    setShowDetail(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setActionError('');
    setShowForm(false);
    setEditingIncome(null);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setActionError('');
    setShowDetail(false);
    setViewingIncome(null);
  }, []);

  const handleSaveIncome = useCallback(async (incomeData) => {
    setIsSaving(true);
    setActionError('');
    try {
      if (editingIncome) {
        await updateIncome(editingIncome.id, incomeData);
      } else {
        await createIncome(incomeData);
      }
      setPage(1);
      setReloadVersion((version) => version + 1);
      handleCloseForm();
      return true;
    } catch (error) {
      setActionError(getApiErrorMessage(error));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [editingIncome, handleCloseForm]);

  const handleDeleteIncome = useCallback(async (incomeId) => {
    setIsDeleting(true);
    setActionError('');
    try {
      await deleteIncome(incomeId);
      handleCloseDetail();
      setReloadVersion((version) => version + 1);
      return true;
    } catch (error) {
      setActionError(getApiErrorMessage(error));
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [handleCloseDetail]);

  const handleSetFilters = useCallback((nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
  }, []);
  const handleClearFilters = useCallback(() => handleSetFilters(initialFilters), [handleSetFilters]);
  const handleDetailEdit = useCallback(() => {
    const incomeToEdit = viewingIncome;
    handleCloseDetail();
    if (incomeToEdit) handleEditIncome(incomeToEdit);
  }, [handleCloseDetail, handleEditIncome, viewingIncome]);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(async () => {
      setIsLoading(true);
      setLoadError('');
      try {
        const params = {
          ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '')),
          page,
          limit: pageSize,
        };
        const result = await listIncome(params);
        if (!active) return;
        const payload = result.data || {};
        const nextTotalPages = Math.max(result.meta?.pages || 1, 1);
        if (page > nextTotalPages) {
          setPage(nextTotalPages);
          return;
        }
        setTransactions((payload.items || []).map((item) => ({
          ...item,
          id: item.id || item._id,
          residentId: item.residentId || item.resident?.id || item.resident?._id || '',
          residentName: item.residentName || '',
          resident: item.residentName || (typeof item.resident === 'string' ? item.resident : item.resident?.profile?.name) || '',
        })));
        setStats({ ...emptyStats, ...(payload.stats || {}) });
        setTotal(result.meta?.total || 0);
        setTotalPages(nextTotalPages);
      } catch (error) {
        if (active) setLoadError(getApiErrorMessage(error));
      } finally {
        if (active) setIsLoading(false);
      }
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [filters, page, reloadVersion]);

  useEffect(() => {
    let active = true;
    getSettings()
      .then((settings) => {
        if (active) setCategories((settings.categories?.income || []).filter((category) => category.active !== false));
      })
      .catch((error) => {
        if (active) setSettingsError(getApiErrorMessage(error));
      });
    return () => {
      active = false;
    };
  }, [settingsReloadVersion]);

  useEffect(() => {
    let active = true;
    listAllResidents()
      .then((result) => {
        if (active) setResidents(result);
      })
      .catch((error) => {
        if (active) setResidentsError(getApiErrorMessage(error));
      })
      .finally(() => {
        if (active) setResidentsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [residentsReloadVersion]);

  useEffect(() => {
    if (!location.state?.openAddDialog) return;
    // The route navigation is the external event that requests this UI state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleAddIncome();
    window.history.replaceState({}, document.title);
  }, [handleAddIncome, location.state?.openAddDialog]);

  useEffect(() => {
    // Header actions are delivered through the route outlet context.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (triggerAddIncome > 0) handleAddIncome();
  }, [handleAddIncome, triggerAddIncome]);

  return {
    showForm,
    showDetail,
    editingIncome,
    viewingIncome,
    transactions,
    stats,
    categories,
    residents,
    residentsLoading,
    residentsError,
    filters,
    setFilters: handleSetFilters,
    page,
    total,
    totalPages,
    isLoading,
    isSaving,
    isDeleting,
    error: loadError || settingsError,
    actionError,
    retry: () => {
      setSettingsError('');
      setResidentsError('');
      setResidentsLoading(true);
      setReloadVersion((version) => version + 1);
      setResidentsReloadVersion((version) => version + 1);
      setSettingsReloadVersion((version) => version + 1);
    },
    setPage,
    handleAddIncome,
    handleEditIncome,
    handleViewIncome,
    handleCloseForm,
    handleCloseDetail,
    handleSaveIncome,
    handleDeleteIncome,
    handleClearFilters,
    handleDetailEdit,
  };
};

export default useIncomePage;
