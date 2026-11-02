import * as residentService from '../services/residentService.js';
import { listResidentPayments } from '../services/paymentService.js';
import { listUpcomingMaintenance } from '../services/maintenanceService.js';
import recordAuditEvent from '../services/auditService.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { sendData } from '../utils/response.js';

export const list = asyncHandler(async (req, res) => {
  const result = await residentService.listResidents(req.validated.query);
  return sendData(res, result.items, 200, result.meta);
});

export const create = asyncHandler(async (req, res) => {
  const resident = await residentService.createResident(req.validated.body);
  await recordAuditEvent({ actor: req.user, action: 'created', entity: 'resident', entityId: resident.id, summary: resident.email, ipAddress: req.ip });
  return sendData(res, resident, 201);
});

export const update = asyncHandler(async (req, res) => {
  const resident = await residentService.updateResident(req.validated.params.id, req.validated.body);
  await recordAuditEvent({ actor: req.user, action: 'updated', entity: 'resident', entityId: resident.id, summary: resident.email, ipAddress: req.ip });
  return sendData(res, resident);
});

export const remove = asyncHandler(async (req, res) => {
  const resident = await residentService.disableResident(req.validated.params.id);
  await recordAuditEvent({ actor: req.user, action: 'disabled', entity: 'resident', entityId: resident.id, summary: resident.email, ipAddress: req.ip });
  return sendData(res, resident);
});

export const listDues = asyncHandler(async (req, res) => {
  const result = await residentService.getResidentDues(req.user.id, req.validated.query);
  return sendData(res, result.items, 200, result.meta);
});

export const listAllDues = asyncHandler(async (req, res) => {
  const result = await residentService.getResidentDues(req.validated.params.id, req.validated.query);
  return sendData(res, result.items, 200, result.meta);
});

export const listDuesForAdmin = asyncHandler(async (req, res) => {
  const result = await residentService.listAllDues(req.validated.query);
  return sendData(res, { items: result.items, stats: result.stats }, 200, result.meta);
});

export const createDue = asyncHandler(async (req, res) => {
  const due = await residentService.createDue(req.validated.body);
  await recordAuditEvent({ actor: req.user, action: 'created', entity: 'maintenance_due', entityId: due.id, summary: due.month, ipAddress: req.ip });
  return sendData(res, due, 201);
});

export const dashboard = asyncHandler(async (req, res) => {
  if (req.user.role !== 'resident') throw new ApiError(403, 'Resident account required.');
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const yearStart = new Date(new Date().getFullYear(), 0, 1);
  const [dues, payments, thisMonthPayments, yearPayments, maintenance] = await Promise.all([
    residentService.getResidentDues(req.user.id, { page: '1', limit: '100' }),
    listResidentPayments(req.user.id, { page: '1', limit: '5' }),
    listResidentPayments(req.user.id, { page: '1', limit: '1', dateFrom: monthStart.toISOString().slice(0, 10) }),
    listResidentPayments(req.user.id, { page: '1', limit: '1', dateFrom: yearStart.toISOString().slice(0, 10) }),
    listUpcomingMaintenance({ page: '1', limit: '3' }),
  ]);
  const pendingDues = dues.items.filter((due) => ['pending', 'partially_paid'].includes(due.status));
  const totalDue = pendingDues.reduce((sum, due) => sum + due.amount + due.penalty - due.paidAmount, 0);
  return sendData(res, {
    stats: {
      myDueAmount: totalDue,
      paidThisMonth: thisMonthPayments.stats.totalPaid,
      totalPaidYear: yearPayments.stats.totalPaid,
      pendingReceipts: payments.stats.completedCount,
    },
    dues: pendingDues,
    recentPayments: payments.items,
    maintenance: maintenance.items,
  });
});
