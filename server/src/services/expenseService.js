import Expense from '../models/Expense.js';
import parsePagination from '../utils/parsePagination.js';

const makeExpenseFilter = ({ search, category, vendor, status, dateFrom, dateTo }) => {
  const filter = {};
  if (category) filter.category = category;
  if (status) filter.paymentStatus = status;
  if (vendor) filter.vendor = { $regex: vendor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
  if (dateFrom || dateTo) {
    filter.date = {};
    if (dateFrom) filter.date.$gte = new Date(dateFrom);
    if (dateTo) filter.date.$lte = new Date(`${dateTo}T23:59:59.999Z`);
  }
  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { description: { $regex: escaped, $options: 'i' } },
      { vendor: { $regex: escaped, $options: 'i' } },
      { transactionRef: { $regex: escaped, $options: 'i' } },
    ];
  }
  return filter;
};

export const listExpenses = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = makeExpenseFilter(query);
  const [items, total, stats] = await Promise.all([
    Expense.find(filter).sort({ date: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    Expense.countDocuments(filter),
    Expense.aggregate([
      { $match: filter },
      { $group: { _id: null, totalExpenses: { $sum: '$amount' }, transactionCount: { $sum: 1 } } },
    ]),
  ]);
  return {
    items,
    stats: stats[0] || { totalExpenses: 0, transactionCount: 0 },
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const createExpense = (data, actorId) => Expense.create({
  ...data,
  createdBy: actorId,
  updatedBy: actorId,
});

export const updateExpense = async (id, data, actorId) => (
  Expense.findByIdAndUpdate(id, { ...data, updatedBy: actorId }, { new: true, runValidators: true })
);

export const deleteExpense = (id) => Expense.findByIdAndDelete(id);
