import { useCallback, useEffect, useState } from 'react';
import { listAllDues, listPayments, listResidents, createResident, updateResident, disableResident } from '../../../../services/api/adminApi';
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
  const [editingResident, setEditingResident] = useState(null);
  const [loadedTab, setLoadedTab] = useState('');
  const [error, setError] = useState('');

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
    const payments = await loadAllPages((page) => listPayments({ page, limit: 100, status: 'completed' }));
    return payments.map((payment) => ({
      ...payment,
      id: payment.id || payment._id,
      paymentDate: payment.date,
      resident: payment.resident?.profile?.name || payment.resident?.email || '',
      flat: [payment.resident?.profile?.wing, payment.resident?.profile?.flatNo].filter(Boolean).join('-'),
      period: payment.month || payment.category,
      mode: payment.paymentMode,
      reference: payment.transactionId || payment.receiptNo || '',
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
        if (active) setError(getApiErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setLoadedTab(activeTab);
      });
    return () => { active = false; };
  }, [activeTab, loadDues, loadPayments, loadResidents]);

  const addResident = () => {
    setEditingResident(null);
    setShowForm(true);
  };

  const editResident = (resident) => {
    setEditingResident(resident);
    setShowForm(true);
  };

  const deleteResident = async (residentId) => {
    if (!window.confirm('Are you sure you want to deactivate this resident?')) return;
    setError('');
    try {
      const updatedResident = await disableResident(residentId);
      setResidents((currentResidents) => currentResidents.map((resident) => (
        resident.id === residentId ? updatedResident : resident
      )));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingResident(null);
  };

  const saveResident = async (residentData) => {
    setError('');
    try {
      const resident = editingResident
        ? await updateResident(editingResident.id, residentData)
        : await createResident(residentData);
      setResidents((currentResidents) => editingResident
        ? currentResidents.map((item) => item.id === resident.id ? resident : item)
        : [resident, ...currentResidents]);
      closeForm();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  };

  return {
    activeTab,
    setActiveTab: (tab) => {
      setError('');
      setActiveTab(tab);
    },
    residents,
    maintenanceDues,
    paymentHistory,
    duesSummary,
    tabs,
    showForm,
    editingResident,
    isLoading: loadedTab !== activeTab,
    error,
    addResident,
    editResident,
    deleteResident,
    closeForm,
    saveResident,
    getStatusColor,
  };
};

export default useResidentsPage;
