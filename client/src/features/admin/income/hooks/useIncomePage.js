import { useCallback, useEffect, useState } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { incomeStats, incomeTransactions } from '../data/mockIncomeData';

const initialFilters = {
  search: '',
  dateFrom: '',
  dateTo: '',
  category: '',
  paymentMode: '',
};

const filterIncomeTransactions = (transactions, filters) => {
  let filtered = [...transactions];

  if (filters.search.trim()) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter((transaction) =>
      transaction.description?.toLowerCase().includes(search)
      || transaction.id?.toLowerCase().includes(search)
      || transaction.resident?.toLowerCase().includes(search)
      || transaction.flat?.toLowerCase().includes(search));
  }
  if (filters.dateFrom) {
    filtered = filtered.filter((transaction) => new Date(transaction.date) >= new Date(filters.dateFrom));
  }
  if (filters.dateTo) {
    filtered = filtered.filter((transaction) => new Date(transaction.date) <= new Date(filters.dateTo));
  }
  if (filters.category) {
    filtered = filtered.filter((transaction) => transaction.category === filters.category);
  }
  if (filters.paymentMode) {
    filtered = filtered.filter((transaction) => transaction.paymentMode === filters.paymentMode);
  }

  return filtered;
};

const calculateIncomeStats = (transactions, previousStats, isEdit) => {
  const totalIncome = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const averageAmount = transactions.length ? Math.round(totalIncome / transactions.length) : 0;
  if (isEdit) {
    return { ...previousStats, totalIncome, averageAmount };
  }

  return {
    totalIncome,
    transactionCount: transactions.length,
    averageAmount,
  };
};

const useIncomePage = () => {
  const location = useLocation();
  const outletContext = useOutletContext();
  const triggerAddIncome = outletContext?.triggerAddIncome || 0;
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [viewingIncome, setViewingIncome] = useState(null);
  const [transactions, setTransactions] = useState(incomeTransactions);
  const [stats, setStats] = useState(incomeStats);
  const [filters, setFilters] = useState(initialFilters);

  const handleAddIncome = useCallback(() => {
    setEditingIncome(null);
    setShowForm(true);
  }, []);

  const handleEditIncome = useCallback((income) => {
    setEditingIncome(income);
    setShowForm(true);
  }, []);

  const handleViewIncome = useCallback((income) => {
    setViewingIncome(income);
    setShowDetail(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditingIncome(null);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setShowDetail(false);
    setViewingIncome(null);
  }, []);

  const handleSaveIncome = useCallback((incomeData) => {
    const updatedTransactions = editingIncome
      ? transactions.map((transaction) => transaction.id === editingIncome.id
        ? { ...transaction, ...incomeData, id: transaction.id }
        : transaction)
      : [{
        ...incomeData,
        id: `INC-${String(transactions.length + 1).padStart(3, '0')}`,
      }, ...transactions];

    setTransactions(updatedTransactions);
    setStats((currentStats) => calculateIncomeStats(updatedTransactions, currentStats, Boolean(editingIncome)));
    handleCloseForm();
  }, [editingIncome, handleCloseForm, transactions]);

  const handleDeleteIncome = useCallback((incomeId) => {
    const updatedTransactions = transactions.filter((transaction) => transaction.id !== incomeId);
    setTransactions(updatedTransactions);
    setStats((currentStats) => calculateIncomeStats(updatedTransactions, currentStats, false));
    handleCloseDetail();
  }, [handleCloseDetail, transactions]);

  const handleClearFilters = useCallback(() => setFilters(initialFilters), []);
  const handleDetailEdit = useCallback(() => {
    const incomeToEdit = viewingIncome;
    handleCloseDetail();
    if (incomeToEdit) handleEditIncome(incomeToEdit);
  }, [handleCloseDetail, handleEditIncome, viewingIncome]);

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
    transactions: filterIncomeTransactions(transactions, filters),
    stats,
    filters,
    setFilters,
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
