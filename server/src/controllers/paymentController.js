import * as paymentService from '../services/paymentService.js';
import recordAuditEvent from '../services/auditService.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { sendData } from '../utils/response.js';

export const listMine = asyncHandler(async (req, res) => {
  const result = await paymentService.listResidentPayments(req.user.id, req.validated.query);
  return sendData(res, { items: result.items, stats: result.stats }, 200, result.meta);
});

export const listAll = asyncHandler(async (req, res) => {
  const result = await paymentService.listAdminPayments(req.validated.query);
  return sendData(res, result.items, 200, result.meta);
});

export const getOne = asyncHandler(async (req, res) => (
  sendData(res, await paymentService.getPaymentById(req.validated.params.id))
));

export const initiate = asyncHandler(async (req, res) => {
  if (req.user.role !== 'resident') throw new ApiError(403, 'Resident account required.');
  const payment = await paymentService.initiateResidentPayment(req.user.id, req.validated.body);
  return sendData(res, payment, 201);
});

export const createManual = asyncHandler(async (req, res) => {
  const payment = await paymentService.createManualPayment(req.validated.body, req.user.id);
  await recordAuditEvent({ actor: req.user, action: 'recorded', entity: 'payment', entityId: payment.id, summary: payment.amount.toString(), ipAddress: req.ip });
  return sendData(res, payment, 201);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const payment = await paymentService.updatePaymentStatus(
    req.validated.params.id,
    req.validated.body.status,
    req.user.id,
  );
  await recordAuditEvent({ actor: req.user, action: 'status_updated', entity: 'payment', entityId: payment.id, summary: payment.status, ipAddress: req.ip });
  return sendData(res, payment);
});

export const listReceipts = asyncHandler(async (req, res) => {
  const result = await paymentService.listResidentPayments(req.user.id, {
    ...req.validated.query,
    status: 'completed',
  });
  return sendData(res, result.items, 200, result.meta);
});

export const residentReport = asyncHandler(async (req, res) => {
  const result = await paymentService.getResidentPaymentReport(req.user.id, req.validated.query);
  return sendData(res, result);
});
