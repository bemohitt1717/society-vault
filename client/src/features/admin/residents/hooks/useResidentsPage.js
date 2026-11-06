import { useCallback, useEffect, useState } from 'react';
import {
  createDue,
  disableResident,
  listAllDues,
  listPayments,
  listResidents,
  recordManualPayment,
  updatePaymentStatus,
  updateResident,
} from '../../../../services/api/adminApi';
import { getApiErrorMessage } from '../../../../services/api/http';

const tabs = [
  { id: 'residents', label: 'Residents & Flats' },
  { id: 'dues', label: 'Maintenance Dues' },
  { id: 'payments', label: 'Payment History' },
];

const emptyDuesSummary = { totalOutstanding: 0, overdueAmount: 0, unpaidBills: 0 };

const getStatusColor = (status) => {
  switch (status) {
    case 'Paid':
    case 'Active':
      return 'text-[#8db5a2]';
    case 'Pending':
    case 'Partially Paid':
      return 'text-[#d2b88e]';
    case 'Overdue':
    case 'Inactive':
      return 'text-[#c99393]';
    default:
      return 'text-[#aeb4bf]';
  }
};

const loadAllPages = async (fetchPage) => {
  const first = await fetchPage(1);
  const pages = first.meta?.pages || 1;
  if (pages <= 1) return first.data;
  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, index) => fetchPage(index + 2)),
  );
  return [...first.data, ...rest.flatMap((result) => result.data)];
};

const useResidentsPage = () => {
  const [activeTab, setActiveTab] = useState('residents');
  const [residents, setResidents] = useState([]);
  const [maintenanceDues, setMaintenanceDues] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [duesSummary, setDuesSummary] = useState(emptyDuesSummary);
  const [showForm, setShowForm] = useState(false);
  const [showDueForm, setShowDueForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingResident, setEditingResident] = useState(null);
  const [paymentReview, setPaymentReview] = useState(null);
  const [paymentReviewError, setPaymentReviewError] = useState('');
  const [loadedTab, setLoadedTab] = useState('');
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isActionSaving, setIsActionSaving] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);

  const loadResidents = useCallback(async () => loadAllPages(
    (page) => listResidents({ page, limit: 100 }),
  ), []);

  const loadDues = useCallback(async () => {
    const first = await listAllDues({ page: 1, limit: 100 });
    const { items, stats } = first.data;
    const rest = first.meta?.pages > 1
      ? await Promise.all(
        Array.from({ length: first.meta.pages - 1 }, (_, index) => listAllDues({ page: index + 2, limit: 100 })),
      )
      : [];
    const dues = [
      ...items,
      ...rest.flatMap((result) => result.data.items),
    ].map((due) => ({
      ...due,
      period: due.month,
      resident: due.residentName,
      amountDue: due.amount + due.penalty,
      amountPaid: due.paidAmount,
      status: due.status === 'cancelled'
        ? 'Cancelled'
        : due.status === 'paid'
        ? 'Paid'
        : due.status === 'partially_paid'
          ? 'Partially Paid'
          : new Date(due.dueDate) < new Date() ? 'Overdue' : 'Pending',
    }));
    return { dues, stats: stats || emptyDuesSummary };
  }, []);

  const loadPayments = useCallback(async () => {
    const payments = await loadAllPages((page) => listPayments({ page, limit: 100 }));
    return payments.map((payment) => ({
      ...payment,
      id: payment.id || payment._id,
      paymentDate: payment.date,
      resident: payment.resident?.profile?.name || payment.resident?.email || '',
      flat: [payment.resident?.profile?.wing, payment.resident?.profile?.flatNo].filter(Boolean).join('-'),
      period: payment.month || payment.category,
      mode: payment.paymentMode,
      reference: payment.transactionId || payment.receiptNo || '',
      statusLabel: payment.status === 'completed'
        ? 'Completed'
        : payment.status === 'pending'
          ? 'Pending verification'
          : payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
    }));
  }, []);

  useEffect(() => {
    let active = true;
    const load = activeTab === 'residents' ? loadResidents : activeTab === 'dues' ? loadDues : loadPayments;
    load()
      .then((data) => {
        if (!active) return;
        if (activeTab === 'residents') setResidents(data);
        else if (activeTab === 'dues') {
          setMaintenanceDues(data.dues);
          setDuesSummary(data.stats);
        } else setPaymentHistory(data);
      })
      .catch((requestError) => {
        if (active) setLoadError(getApiErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setLoadedTab(activeTab);
      });
    return () => { active = false; };
  }, [activeTab, loadAttempt, loadDues, loadPayments, loadResidents]);

  const editResident = (resident) => {
    setEditingResident(resident);
    setShowForm(true);
  };

  const deleteResident = async (residentId) => {
    if (!window.confirm('Are you sure you want to deactivate this resident?')) return;
    setActionError('');
    try {
      const updatedResident = await disableResident(residentId);
      setResidents((currentResidents) => currentResidents.map((resident) => (
        resident.id === residentId
          ? {
            ...resident,
            ...updatedResident,
            outstanding: updatedResident.outstanding ?? resident.outstanding ?? 0,
            totalPaid: updatedResident.totalPaid ?? resident.totalPaid ?? 0,
          }
          : resident
      )));
    } catch (requestError) {
      setActionError(getApiErrorMessage(requestError));
    }
  };

  const ensureResidentsLoaded = async () => {
    if (residents.length) return residents;
    const result = await loadResidents();
    setResidents(result);
    return result;
  };

  const openDueForm = async () => {
    setActionError('');
    try {
      await ensureResidentsLoaded();
      setShowDueForm(true);
    } catch (requestError) {
      setActionError(getApiErrorMessage(requestError));
    }
  };

  const openPaymentForm = async () => {
    setActionError('');
    try {
      await ensureResidentsLoaded();
      setShowPaymentForm(true);
    } catch (requestError) {
      setActionError(getApiErrorMessage(requestError));
    }
  };

  const closeDueForm = () => {
    if (!isActionSaving) setShowDueForm(false);
  };

  const closePaymentForm = () => {
    if (!isActionSaving) setShowPaymentForm(false);
  };

  const saveDue = async (dueData) => {
    if (isActionSaving) return;
    setActionError('');
    setIsActionSaving(true);
    try {
      await createDue(dueData);
      setShowDueForm(false);
      setLoadedTab('');
      setLoadAttempt((attempt) => attempt + 1);
    } catch (requestError) {
      setActionError(getApiErrorMessage(requestError));
    } finally {
      setIsActionSaving(false);
    }
  };

  const savePayment = async (paymentData) => {
    if (isActionSaving) return;
    setActionError('');
    setIsActionSaving(true);
    try {
      await recordManualPayment(paymentData);
      setShowPaymentForm(false);
      setLoadedTab('');
      setLoadAttempt((attempt) => attempt + 1);
    } catch (requestError) {
      setActionError(getApiErrorMessage(requestError));
    } finally {
      setIsActionSaving(false);
    }
  };

  const requestPaymentReview = (payment, status) => {
    setPaymentReviewError('');
    setPaymentReview({ payment, status });
  };

  const cancelPaymentReview = () => {
    if (!isActionSaving) {
      setPaymentReview(null);
      setPaymentReviewError('');
    }
  };

  const confirmPaymentReview = async () => {
    if (!paymentReview || isActionSaving) return;
    setPaymentReviewError('');
    setIsActionSaving(true);
    try {
      await updatePaymentStatus(paymentReview.payment.id, paymentReview.status);
      setPaymentReview(null);
      setLoadedTab('');
      setLoadAttempt((attempt) => attempt + 1);
    } catch (requestError) {
      setPaymentReviewError(getApiErrorMessage(requestError));
    } finally {
      setIsActionSaving(false);
    }
  };

  const closeForm = () => {
    if (isSaving) return;
    setShowForm(false);
    setEditingResident(null);
    setSaveError('');
  };

  const saveResident = async (residentData) => {
    if (isSaving) return;
    setSaveError('');
    setIsSaving(true);
    try {
      const resident = await updateResident(editingResident.id, residentData);
      setResidents((currentResidents) => currentResidents.map((item) => item.id === resident.id
        ? {
          ...item,
          ...resident,
          outstanding: resident.outstanding ?? item.outstanding ?? 0,
          totalPaid: resident.totalPaid ?? item.totalPaid ?? 0,
        }
        : item));
      closeForm();
    } catch (requestError) {
      setSaveError(getApiErrorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  };

  const retryLoad = () => {
    setLoadError('');
    setLoadedTab('');
    setLoadAttempt((attempt) => attempt + 1);
  };

  return {
    activeTab,
    setActiveTab: (tab) => {
      setLoadError('');
      setActionError('');
      setActiveTab(tab);
    },
    residents,
    maintenanceDues,
    paymentHistory,
    duesSummary,
    tabs,
    showForm,
    showDueForm,
    showPaymentForm,
    editingResident,
    paymentReview,
    paymentReviewError,
    isLoading: loadedTab !== activeTab,
    loadError,
    actionError,
    saveError,
    isSaving,
    isActionSaving,
    editResident,
    deleteResident,
    closeForm,
    saveResident,
    retryLoad,
    openDueForm,
    openPaymentForm,
    closeDueForm,
    closePaymentForm,
    saveDue,
    savePayment,
    requestPaymentReview,
    confirmPaymentReview,
    cancelPaymentReview,
    getStatusColor,
  };
};

export default useResidentsPage;
