import { useCallback, useEffect, useState } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { expenseStats, expenseTransactions } from '../data/mockExpenseData';

const initialFilters = {
  search: '',
  dateFrom: '',
  dateTo: '',
  category: '',
  vendor: '',
  status: '',
};

const filterExpenseTransactions = (transactions, filters) => {
  let filtered = [...transactions];

  if (filters.search.trim()) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter((transaction) =>
      transaction.description?.toLowerCase().includes(search)
      || transaction.id?.toLowerCase().includes(search)
      || transaction.vendor?.toLowerCase().includes(search)
      || transaction.category?.toLowerCase().includes(search));
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
  if (filters.vendor.trim()) {
    const vendor = filters.vendor.toLowerCase();
    filtered = filtered.filter((transaction) => transaction.vendor?.toLowerCase().includes(vendor));
  }
  if (filters.status) {
    filtered = filtered.filter((transaction) => transaction.paymentStatus === filters.status);
  }

  return filtered;
};

const calculateExpenseStats = (transactions, currentStats) => ({
  totalExpenses: transactions.reduce((sum, transaction) => sum + transaction.amount, 0),
  transactionCount: transactions.length,
  topCategory: currentStats.topCategory,
});

const useExpensePage = () => {
  const location = useLocation();
  const outletContext = useOutletContext();
  const triggerAddExpense = outletContext?.triggerAddExpense || 0;
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [viewingExpense, setViewingExpense] = useState(null);
  const [transactions, setTransactions] = useState(expenseTransactions);
  const [stats, setStats] = useState(expenseStats);
  const [filters, setFilters] = useState(initialFilters);

  const handleAddExpense = useCallback(() => {
    setEditingExpense(null);
    setShowForm(true);
  }, []);

  const handleEditExpense = useCallback((expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  }, []);

  const handleViewExpense = useCallback((expense) => {
    setViewingExpense(expense);
    setShowDetail(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditingExpense(null);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setShowDetail(false);
    setViewingExpense(null);
  }, []);

  const handleSaveExpense = useCallback((expenseData) => {
    const updatedTransactions = editingExpense
      ? transactions.map((transaction) => transaction.id === editingExpense.id
        ? { ...transaction, ...expenseData, id: transaction.id }
        : transaction)
      : [{
        ...expenseData,
        id: `EXP-${String(transactions.length + 1).padStart(3, '0')}`,
        hasInvoice: false,
      }, ...transactions];

    setTransactions(updatedTransactions);
    setStats((currentStats) => calculateExpenseStats(updatedTransactions, currentStats));
    handleCloseForm();
  }, [editingExpense, handleCloseForm, transactions]);

  const handleDeleteExpense = useCallback((expenseId) => {
    const updatedTransactions = transactions.filter((transaction) => transaction.id !== expenseId);
    setTransactions(updatedTransactions);
    setStats((currentStats) => calculateExpenseStats(updatedTransactions, currentStats));
    handleCloseDetail();
  }, [handleCloseDetail, transactions]);

  const handleClearFilters = useCallback(() => setFilters(initialFilters), []);
  const handleDetailEdit = useCallback(() => {
    const expenseToEdit = viewingExpense;
    handleCloseDetail();
    if (expenseToEdit) handleEditExpense(expenseToEdit);
  }, [handleCloseDetail, handleEditExpense, viewingExpense]);

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
    transactions: filterExpenseTransactions(transactions, filters),
    stats,
    filters,
    setFilters,
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
