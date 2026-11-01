import MaintenanceSchedule from '../models/MaintenanceSchedule.js';
import parsePagination from '../utils/parsePagination.js';
import ApiError from '../utils/ApiError.js';

export const listUpcomingMaintenance = async (query = {}) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = { status: 'scheduled', date: { $gte: new Date() } };
  const [items, total] = await Promise.all([
    MaintenanceSchedule.find(filter).sort({ date: 1 }).skip(skip).limit(limit).lean(),
    MaintenanceSchedule.countDocuments(filter),
  ]);
  return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
};

export const createMaintenance = (data, actorId) => MaintenanceSchedule.create({ ...data, createdBy: actorId });

export const updateMaintenance = async (id, data) => {
  const item = await MaintenanceSchedule.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!item) throw new ApiError(404, 'Maintenance schedule item not found.');
  return item;
};

export const deleteMaintenance = async (id) => {
  const item = await MaintenanceSchedule.findByIdAndDelete(id);
  if (!item) throw new ApiError(404, 'Maintenance schedule item not found.');
  return item;
};
