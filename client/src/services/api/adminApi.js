import api from './http';

const toResidentPayload = (data) => {
  const [wing = '', ...flatParts] = (data.flat || '').split('-');
  const flatNo = flatParts.join('-');
  return {
    email: data.email,
    profile: {
      name: data.name,
      phone: data.contact,
      wing: flatNo ? wing : '',
      flatNo: flatNo || data.flat || '',
      type: data.type,
      maintenanceAmount: Number(data.maintenanceAmount) || 0,
      membershipStatus: data.status || 'Active',
    },
  };
};

const fromResident = (resident) => ({
  ...resident,
  id: resident.id || resident._id,
  name: resident.profile?.name || '',
  flat: [resident.profile?.wing, resident.profile?.flatNo].filter(Boolean).join('-'),
  type: resident.profile?.type || 'Owner',
  contact: resident.profile?.phone || '',
  maintenanceAmount: resident.profile?.maintenanceAmount || 0,
  status: resident.profile?.membershipStatus || (resident.status === 'disabled' ? 'Inactive' : 'Active'),
});

const toIncomePayload = ({ resident, ...data }) => ({
  ...data,
  residentName: typeof resident === 'string' ? resident : '',
  resident: undefined,
});

export const getAdminDashboard = async () => (await api.get('/dashboard/admin')).data.data;

export const listIncome = async (params) => (await api.get('/income', { params })).data;
export const createIncome = async (data) => (await api.post('/income', toIncomePayload(data))).data.data;
export const updateIncome = async (id, data) => (await api.put(`/income/${id}`, toIncomePayload(data))).data.data;
export const deleteIncome = async (id) => api.delete(`/income/${id}`);

export const listExpenses = async (params) => (await api.get('/expenses', { params })).data;
export const createExpense = async (data) => (await api.post('/expenses', data)).data.data;
export const updateExpense = async (id, data) => (await api.put(`/expenses/${id}`, data)).data.data;
export const deleteExpense = async (id) => api.delete(`/expenses/${id}`);

export const listResidents = async (params) => {
  const result = (await api.get('/residents', { params })).data;
  return { ...result, data: result.data.map(fromResident) };
};
export const createResident = async (data) => fromResident((await api.post('/residents', toResidentPayload(data))).data.data);
export const updateResident = async (id, data) => fromResident((await api.put(`/residents/${id}`, toResidentPayload(data))).data.data);
export const disableResident = async (id) => fromResident((await api.delete(`/residents/${id}`)).data.data);
export const listResidentDues = async (residentId, params) => (
  await api.get(`/residents/${residentId}/dues`, { params })
).data;
export const createDue = async (data) => (await api.post('/residents/dues', data)).data.data;

export const listPayments = async (params) => (await api.get('/payments', { params })).data;
export const getPayment = async (id) => (await api.get(`/payments/${id}`)).data.data;
export const recordManualPayment = async (data) => (await api.post('/payments/manual', data)).data.data;
export const updatePaymentStatus = async (id, status) => (
  await api.patch(`/payments/${id}/status`, { status })
).data.data;

export const getSettings = async () => (await api.get('/settings')).data.data;
export const updateSettings = async (data) => (await api.put('/settings', data)).data.data;
export const createCategory = async (data) => (await api.post('/settings/categories', data)).data.data;
export const updateCategory = async (id, data) => (await api.put(`/settings/categories/${id}`, data)).data.data;
export const deleteCategory = async (id) => api.delete(`/settings/categories/${id}`);

export const getFinancialReport = async (params) => (await api.get('/dashboard/reports/financial', { params })).data.data;
export const listAuditLogs = async (params) => (await api.get('/audit-logs', { params })).data;
