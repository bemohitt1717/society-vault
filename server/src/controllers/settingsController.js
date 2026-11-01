import * as settingsService from '../services/settingsService.js';
import recordAuditEvent from '../services/auditService.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { sendData } from '../utils/response.js';

export const get = asyncHandler(async (_req, res) => sendData(res, await settingsService.getSettings()));

export const update = asyncHandler(async (req, res) => {
  const settings = await settingsService.updateSettings(req.validated.body);
  await recordAuditEvent({ actor: req.user, action: 'updated', entity: 'society_settings', entityId: settings.id, summary: settings.name, ipAddress: req.ip });
  return sendData(res, settings);
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await settingsService.createCategory(req.validated.body);
  await recordAuditEvent({ actor: req.user, action: 'created', entity: 'category', entityId: category.id, summary: category.name, ipAddress: req.ip });
  return sendData(res, category, 201);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await settingsService.updateCategory(req.validated.params.id, req.validated.body);
  await recordAuditEvent({ actor: req.user, action: 'updated', entity: 'category', entityId: category.id, summary: category.name, ipAddress: req.ip });
  return sendData(res, category);
});

export const removeCategory = asyncHandler(async (req, res) => {
  const category = await settingsService.removeCategory(req.validated.params.id);
  await recordAuditEvent({ actor: req.user, action: 'deleted', entity: 'category', entityId: category.id, summary: category.name, ipAddress: req.ip });
  return res.status(204).end();
});
