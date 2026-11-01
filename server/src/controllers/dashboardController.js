import { getAdminDashboard, getFinancialReports, getResidentFinances } from '../services/dashboardService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendData } from '../utils/response.js';

export const adminDashboard = asyncHandler(async (_req, res) => sendData(res, await getAdminDashboard()));

export const residentFinances = asyncHandler(async (req, res) => {
  const result = await getResidentFinances(req.validated.query);
  return sendData(res, { stats: result.stats, items: result.items }, 200, result.meta);
});

export const reports = asyncHandler(async (_req, res) => sendData(res, await getFinancialReports()));
