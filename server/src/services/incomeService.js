import Income from '../models/Income.js';
import parsePagination from '../utils/parsePagination.js';

const makeIncomeFilter = ({ search, category, paymentMode, dateFrom, dateTo }) => {
  const filter = {};
  if (category) filter.category = category;
  if (paymentMode) filter.paymentMode = paymentMode;
  if (dateFrom || dateTo) {
    filter.date = {};
    if (dateFrom) filter.date.$gte = new Date(dateFrom);
    if (dateTo) filter.date.$lte = new Date(`${dateTo}T23:59:59.999Z`);
  }
  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { description: { $regex: escaped, $options: 'i' } },
      { transactionRef: { $regex: escaped, $options: 'i' } },
      { residentName: { $regex: escaped, $options: 'i' } },
      { flat: { $regex: escaped, $options: 'i' } },
    ];
  }
  return filter;
};

export const listIncome = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = makeIncomeFilter(query);
  const [items, total, totals] = await Promise.all([
    Income.find(filter)
      .populate('resident', 'email profile.name profile.flatNo profile.wing')
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Income.countDocuments(filter),
    Income.aggregate([
      { $match: filter },
      { $group: { _id: null, totalIncome: { $sum: '$amount' }, transactionCount: { $sum: 1 }, averageAmount: { $avg: '$amount' } } },
    ]),
  ]);
  const stats = totals[0] || { totalIncome: 0, transactionCount: 0, averageAmount: 0 };
  return {
    items: items.map((item) => ({
      ...item,
      residentName: item.resident?.profile?.name || item.residentName || '',
      resident: item.resident?.profile?.name || item.residentName || '',
      flat: item.flat || [item.resident?.profile?.wing, item.resident?.profile?.flatNo].filter(Boolean).join('-'),
    })),
    stats: { ...stats, averageAmount: Math.round(stats.averageAmount || 0) },
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const createIncome = (data, actorId) => Income.create({ ...data, createdBy: actorId });

export const updateIncome = async (id, data) => (
  Income.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate('resident', 'email profile.name profile.flatNo profile.wing')
);

export const deleteIncome = (id) => Income.findByIdAndDelete(id);
