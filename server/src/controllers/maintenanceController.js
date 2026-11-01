import * as maintenanceService from '../services/maintenanceService.js';
import recordAuditEvent from '../services/auditService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendData } from '../utils/response.js';

export const listUpcoming = asyncHandler(async (req, res) => {
  const result = await maintenanceService.listUpcomingMaintenance(req.validated.query);
  return sendData(res, result.items, 200, result.meta);
});

export const create = asyncHandler(async (req, res) => {
  const item = await maintenanceService.createMaintenance(req.validated.body, req.user.id);
  await recordAuditEvent({ actor: req.user, action: 'created', entity: 'maintenance_schedule', entityId: item.id, summary: item.title, ipAddress: req.ip });
  return sendData(res, item, 201);
});

export const update = asyncHandler(async (req, res) => {
  const item = await maintenanceService.updateMaintenance(req.validated.params.id, req.validated.body);
  await recordAuditEvent({ actor: req.user, action: 'updated', entity: 'maintenance_schedule', entityId: item.id, summary: item.title, ipAddress: req.ip });
  return sendData(res, item);
});

export const remove = asyncHandler(async (req, res) => {
  const item = await maintenanceService.deleteMaintenance(req.validated.params.id);
  await recordAuditEvent({ actor: req.user, action: 'deleted', entity: 'maintenance_schedule', entityId: item.id, summary: item.title, ipAddress: req.ip });
  return res.status(204).end();
});
