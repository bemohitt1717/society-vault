import api from './http';

const toResidentPayload = (data) => {
  const [wing = '', ...flatParts] = (data.flat || '').split('-');
  const flatNo = flatParts.join('-');
  const maintenanceAmount = Number(data.maintenanceAmount);
  return {
    email: data.email,
    profile: {
      name: data.name,
      phone: data.contact,
      wing: flatNo ? wing : '',
      flatNo: flatNo || data.flat || '',
      type: data.type,
      maintenanceAmount: Number.isFinite(maintenanceAmount) ? maintenanceAmount : 0,
      membershipStatus: data.status || 'Active',
    },
  };
};

const toAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

const fromResident = (resident) => {
  const profile = resident.profile || {};
  const flat = profile.wing || profile.flatNo
    ? [profile.wing, profile.flatNo].filter(Boolean).join('-')
    : resident.flat || '';

  return {
    ...resident,
    id: resident.id || resident._id,
    accountStatus: resident.status,
    name: profile.name ?? resident.name ?? '',
    flat,
    type: profile.type ?? resident.type ?? 'Owner',
    contact: profile.phone ?? resident.contact ?? '',
    maintenanceAmount: toAmount(profile.maintenanceAmount ?? resident.maintenanceAmount),
    status: profile.membershipStatus ?? (resident.status === 'disabled' ? 'Inactive' : 'Active'),
    ...(resident.outstanding !== undefined ? { outstanding: toAmount(resident.outstanding) } : {}),
    ...(resident.totalPaid !== undefined ? { totalPaid: toAmount(resident.totalPaid) } : {}),
  };
};

const toIncomePayload = ({ residentId, residentName, ...data }) => ({
  ...data,
  resident: residentId || undefined,
  residentName: residentName || '',
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
export const listAllResidents = async () => {
  const first = await listResidents({ page: 1, limit: 100 });
  const pages = first.meta?.pages || 1;
  if (pages <= 1) return first.data;
  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, index) => listResidents({ page: index + 2, limit: 100 })),
  );
  return [...first.data, ...rest.flatMap((result) => result.data)];
};
export const updateResident = async (id, data) => fromResident((await api.put(`/residents/${id}`, toResidentPayload(data))).data.data);
export const disableResident = async (id) => fromResident((await api.delete(`/residents/${id}`)).data.data);
export const listResidentDues = async (residentId, params) => (
  await api.get(`/residents/${residentId}/dues`, { params })
).data;
export const listAllDues = async (params) => (await api.get('/residents/dues', { params })).data;
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
