import * as incomeService from '../services/incomeService.js';
import recordAuditEvent from '../services/auditService.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { sendData } from '../utils/response.js';

export const list = asyncHandler(async (req, res) => {
  const result = await incomeService.listIncome(req.validated.query);
  return sendData(res, { items: result.items, stats: result.stats }, 200, result.meta);
});

export const create = asyncHandler(async (req, res) => {
  const item = await incomeService.createIncome(req.validated.body, req.user.id);
  await recordAuditEvent({ actor: req.user, action: 'created', entity: 'income', entityId: item.id, summary: item.description, ipAddress: req.ip });
  return sendData(res, item, 201);
});

export const update = asyncHandler(async (req, res) => {
  const item = await incomeService.updateIncome(req.validated.params.id, req.validated.body);
  if (!item) throw new ApiError(404, 'Income record not found.');
  await recordAuditEvent({ actor: req.user, action: 'updated', entity: 'income', entityId: item.id, summary: item.description, ipAddress: req.ip });
  return sendData(res, item);
});

export const remove = asyncHandler(async (req, res) => {
  const item = await incomeService.deleteIncome(req.validated.params.id);
  if (!item) throw new ApiError(404, 'Income record not found.');
  await recordAuditEvent({ actor: req.user, action: 'deleted', entity: 'income', entityId: item.id, summary: item.description, ipAddress: req.ip });
  return res.status(204).end();
});
