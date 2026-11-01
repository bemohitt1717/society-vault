import * as expenseService from '../services/expenseService.js';
import recordAuditEvent from '../services/auditService.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { sendData } from '../utils/response.js';

export const list = asyncHandler(async (req, res) => {
  const result = await expenseService.listExpenses(req.validated.query);
  return sendData(res, { items: result.items, stats: result.stats }, 200, result.meta);
});

export const create = asyncHandler(async (req, res) => {
  const item = await expenseService.createExpense(req.validated.body, req.user.id);
  await recordAuditEvent({ actor: req.user, action: 'created', entity: 'expense', entityId: item.id, summary: item.description, ipAddress: req.ip });
  return sendData(res, item, 201);
});

export const update = asyncHandler(async (req, res) => {
  const item = await expenseService.updateExpense(req.validated.params.id, req.validated.body, req.user.id);
  if (!item) throw new ApiError(404, 'Expense record not found.');
  await recordAuditEvent({ actor: req.user, action: 'updated', entity: 'expense', entityId: item.id, summary: item.description, ipAddress: req.ip });
  return sendData(res, item);
});

export const remove = asyncHandler(async (req, res) => {
  const item = await expenseService.deleteExpense(req.validated.params.id);
  if (!item) throw new ApiError(404, 'Expense record not found.');
  await recordAuditEvent({ actor: req.user, action: 'deleted', entity: 'expense', entityId: item.id, summary: item.description, ipAddress: req.ip });
  return res.status(204).end();
});
