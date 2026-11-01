import AuditLog from '../models/AuditLog.js';
import parsePagination from '../utils/parsePagination.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendData } from '../utils/response.js';

export const list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.validated.query);
  const filter = {};
  if (req.validated.query.entity) filter.entity = req.validated.query.entity;
  const [items, total] = await Promise.all([
    AuditLog.find(filter).populate('actor', 'email profile.name').sort({ occurredAt: -1 }).skip(skip).limit(limit).lean(),
    AuditLog.countDocuments(filter),
  ]);
  return sendData(res, items, 200, { page, limit, total, pages: Math.ceil(total / limit) });
});
