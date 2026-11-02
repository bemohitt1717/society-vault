import { useCallback, useEffect, useState } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { createExpense, deleteExpense, getSettings, listExpenses, updateExpense } from '../../../../services/api/adminApi';
import { getApiErrorMessage } from '../../../../services/api/http';

const initialFilters = {
  search: '',
  dateFrom: '',
  dateTo: '',
  category: '',
  vendor: '',
  status: '',
};

const emptyStats = { totalExpenses: 0, transactionCount: 0, topCategory: '' };
const pageSize = 20;

const useExpensePage = () => {
  const location = useLocation();
  const outletContext = useOutletContext();
  const triggerAddExpense = outletContext?.triggerAddExpense || 0;
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [viewingExpense, setViewingExpense] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(emptyStats);
  const [categories, setCategories] = useState([]);
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
  const [settingsReloadVersion, setSettingsReloadVersion] = useState(0);

  const handleAddExpense = useCallback(() => {
    setActionError('');
    setEditingExpense(null);
    setShowForm(true);
  }, []);

  const handleEditExpense = useCallback((expense) => {
    setActionError('');
    setEditingExpense(expense);
    setShowForm(true);
  }, []);

  const handleViewExpense = useCallback((expense) => {
    setActionError('');
    setViewingExpense(expense);
    setShowDetail(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setActionError('');
    setShowForm(false);
    setEditingExpense(null);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setActionError('');
    setShowDetail(false);
    setViewingExpense(null);
  }, []);

  const handleSaveExpense = useCallback(async (expenseData) => {
    setIsSaving(true);
    setActionError('');
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, expenseData);
      } else {
        await createExpense(expenseData);
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
  }, [editingExpense, handleCloseForm]);

  const handleDeleteExpense = useCallback(async (expenseId) => {
    setIsDeleting(true);
    setActionError('');
    try {
      await deleteExpense(expenseId);
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
    const expenseToEdit = viewingExpense;
    handleCloseDetail();
    if (expenseToEdit) handleEditExpense(expenseToEdit);
  }, [handleCloseDetail, handleEditExpense, viewingExpense]);

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
        const result = await listExpenses(params);
        if (!active) return;
        const payload = result.data || {};
        const nextTotalPages = Math.max(result.meta?.pages || 1, 1);
        if (page > nextTotalPages) {
          setPage(nextTotalPages);
          return;
        }
        const items = (payload.items || []).map((item) => ({ ...item, id: item.id || item._id }));
        setTransactions(items);
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
        if (active) setCategories((settings.categories?.expense || []).filter((category) => category.active !== false));
      })
      .catch((error) => {
        if (active) setSettingsError(getApiErrorMessage(error));
      });
    return () => {
      active = false;
    };
  }, [settingsReloadVersion]);

  useEffect(() => {
    if (!location.state?.openAddDialog) return;
    // The route navigation is the external event that requests this UI state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleAddExpense();
    window.history.replaceState({}, document.title);
  }, [handleAddExpense, location.state?.openAddDialog]);

  useEffect(() => {
    // Header actions are delivered through the route outlet context.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (triggerAddExpense > 0) handleAddExpense();
  }, [handleAddExpense, triggerAddExpense]);

  return {
    showForm,
    showDetail,
    editingExpense,
    viewingExpense,
    transactions,
    stats,
    categories,
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
      setReloadVersion((version) => version + 1);
      setSettingsReloadVersion((version) => version + 1);
    },
    setPage,
    handleAddExpense,
    handleEditExpense,
    handleViewExpense,
    handleCloseForm,
    handleCloseDetail,
    handleSaveExpense,
    handleDeleteExpense,
    handleClearFilters,
    handleDetailEdit,
  };
};

export default useExpensePage;
