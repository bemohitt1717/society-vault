import api from './http';

const paymentModeToApi = {
  upi: 'UPI',
  bank: 'Bank Transfer',
  card: 'Card',
  cash: 'Cash',
};

const fromDue = (due) => ({
  ...due,
  id: due.id || due._id,
  amount: due.amount,
  penalty: due.penalty || 0,
});

const fromPayment = (payment) => ({
  ...payment,
  id: payment.id || payment._id,
  transactionId: payment.transactionId || '',
  receiptNo: payment.receiptNo || '',
  date: payment.date ? new Date(payment.date).toISOString().slice(0, 10) : '',
  paymentMode: payment.paymentMode,
});

export const getResidentDashboard = async () => {
  const dashboard = (await api.get('/residents/me/dashboard')).data.data;
  return {
    ...dashboard,
    recentPayments: dashboard.recentPayments.map(fromPayment),
    maintenance: dashboard.maintenance.map((item) => ({
      ...item,
      id: item.id || item._id,
      date: item.date ? new Date(item.date).toISOString().slice(0, 10) : '',
    })),
  };
};
export const listMyDues = async (params) => {
  const result = (await api.get('/residents/me/dues', { params })).data;
  return { ...result, data: result.data.map(fromDue) };
};
export const listMyPayments = async (params) => {
  const result = (await api.get('/payments/mine', { params })).data;
  return { ...result, data: result.data.items.map(fromPayment) };
};
export const listMyReceipts = async (params) => {
  const result = (await api.get('/payments/receipts', { params })).data;
  return {
    ...result,
    data: result.data.map((payment) => ({
      ...fromPayment(payment),
      id: payment.receiptNo || payment.id || payment._id,
      status: payment.status === 'completed' ? 'generated' : payment.status,
    })),
  };
};
export const getMyPaymentReport = async (params) => (await api.get('/payments/report', { params })).data.data;
export const initiatePayment = async ({ selectedDues, paymentMethod }) => {
  const payAll = selectedDues.some((due) => due.id === 'ALL');
  const dueIds = payAll ? undefined : selectedDues.map((due) => due.id || due._id);
  return (await api.post('/payments/initiate', {
    dueIds,
    payAll,
    paymentMode: paymentModeToApi[paymentMethod] || paymentMethod,
  })).data.data;
};
export const getSocietyFinances = async (params) => (
  await api.get('/dashboard/resident-finances', { params })
).then(({ data }) => ({
  ...data,
  data: {
    ...data.data,
    transactions: data.data.items,
    recentTransactions: data.data.items,
  },
}));
export const getResidentReport = async (params) => (
  await api.get('/dashboard/reports/resident', { params })
).data.data;
