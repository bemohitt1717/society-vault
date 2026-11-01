import Income from '../models/Income.js';
import Expense from '../models/Expense.js';
import MaintenanceDue from '../models/MaintenanceDue.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import MaintenanceSchedule from '../models/MaintenanceSchedule.js';

const startOfMonth = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), 1);
const startOfYear = (date = new Date()) => new Date(date.getFullYear(), 0, 1);

export const getAdminDashboard = async () => {
  const monthStart = startOfMonth();
  const yearStart = startOfYear();
  const [
    incomeThisMonth,
    expensesThisMonth,
    incomeByMonth,
    expensesByMonth,
    recentIncome,
    recentExpenses,
    residentsCount,
    pendingDues,
    upcomingMaintenance,
  ] = await Promise.all([
    Income.aggregate([{ $match: { date: { $gte: monthStart } } }, { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }]),
    Expense.aggregate([{ $match: { date: { $gte: monthStart }, paymentStatus: { $ne: 'Cancelled' } } }, { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }]),
    Income.aggregate([
      { $match: { date: { $gte: new Date(monthStart.getFullYear(), monthStart.getMonth() - 5, 1) } } },
      { $group: { _id: { year: { $year: '$date' }, month: { $month: '$date' } }, total: { $sum: '$amount' } } },
    ]),
    Expense.aggregate([
      { $match: { date: { $gte: new Date(monthStart.getFullYear(), monthStart.getMonth() - 5, 1) }, paymentStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: { year: { $year: '$date' }, month: { $month: '$date' } }, total: { $sum: '$amount' } } },
    ]),
    Income.find({ date: { $gte: yearStart } }).populate('resident', 'profile.name profile.flatNo profile.wing').sort({ date: -1 }).limit(5).lean(),
    Expense.find({ date: { $gte: yearStart } }).sort({ date: -1 }).limit(5).lean(),
    User.countDocuments({ role: 'resident', status: 'active' }),
    MaintenanceDue.aggregate([
      { $match: { status: { $in: ['pending', 'partially_paid'] } } },
      { $group: { _id: null, amount: { $sum: { $subtract: [{ $add: ['$amount', '$penalty'] }, '$paidAmount'] } }, count: { $sum: 1 } } },
    ]),
    MaintenanceSchedule.find({ status: 'scheduled', date: { $gte: new Date() } }).sort({ date: 1 }).limit(3).lean(),
  ]);

  const monthlyMap = new Map();
  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date(monthStart.getFullYear(), monthStart.getMonth() - offset, 1);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    monthlyMap.set(key, {
      month: date.toLocaleString('en-IN', { month: 'short' }),
      income: 0,
      expenses: 0,
    });
  }
  for (const item of incomeByMonth) {
    const row = monthlyMap.get(`${item._id.year}-${item._id.month}`);
    if (row) row.income = item.total;
  }
  for (const item of expensesByMonth) {
    const row = monthlyMap.get(`${item._id.year}-${item._id.month}`);
    if (row) row.expenses = item.total;
  }

  const income = incomeThisMonth[0] || { total: 0, count: 0 };
  const expenses = expensesThisMonth[0] || { total: 0, count: 0 };
  return {
    stats: {
      totalIncome: income.total,
      totalExpenses: expenses.total,
      residentsCount,
      pendingDues: pendingDues[0]?.amount || 0,
      incomeCount: income.count,
      expenseCount: expenses.count,
    },
    monthlyData: [...monthlyMap.values()],
    recentTransactions: [
      ...recentIncome.map((item) => ({
        id: item.id,
        date: item.date,
        type: 'income',
        description: item.description,
        category: item.category,
        amount: item.amount,
        resident: item.resident?.profile?.name || '',
        flat: [item.resident?.profile?.wing, item.resident?.profile?.flatNo].filter(Boolean).join('-'),
      })),
      ...recentExpenses.map((item) => ({
        id: item.id,
        date: item.date,
        type: 'expense',
        description: item.description,
        category: item.category,
        amount: item.amount,
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8),
    upcomingMaintenance,
  };
};

export const getResidentFinances = async (query = {}) => {
  const page = Math.max(Number.parseInt(query.page || '1', 10), 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit || '20', 10), 1), 100);
  const skip = (page - 1) * limit;
  const [incomeTotal, expenseTotal] = await Promise.all([
    Income.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
    Expense.aggregate([{ $match: { paymentStatus: { $ne: 'Cancelled' } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
  ]);
  const dateFilter = {};
  if (query.dateFrom || query.dateTo) {
    dateFilter.date = {};
    if (query.dateFrom) dateFilter.date.$gte = new Date(query.dateFrom);
    if (query.dateTo) dateFilter.date.$lte = new Date(`${query.dateTo}T23:59:59.999Z`);
  }
  const escapedSearch = query.search?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const searchFilter = escapedSearch
    ? { $or: [{ category: { $regex: escapedSearch, $options: 'i' } }, { description: { $regex: escapedSearch, $options: 'i' } }] }
    : {};
  const [pageResults] = await Income.aggregate([
    { $match: { ...(query.type === 'expense' ? { _id: { $exists: false } } : {}), ...dateFilter, ...searchFilter } },
    { $project: { _id: 1, date: 1, type: { $literal: 'income' }, category: 1, description: 1, amount: 1, status: { $literal: 'completed' } } },
    ...(query.type === 'income' ? [] : [{
      $unionWith: {
        coll: Expense.collection.name,
        pipeline: [
          { $match: { paymentStatus: { $ne: 'Cancelled' }, ...dateFilter, ...searchFilter } },
          { $project: { _id: 1, date: 1, type: { $literal: 'expense' }, category: 1, description: 1, amount: 1, status: { $toLower: '$paymentStatus' } } },
        ],
      },
    }]),
    { $sort: { date: -1, _id: -1 } },
    { $facet: { items: [{ $skip: skip }, { $limit: limit }], count: [{ $count: 'total' }] } },
  ]);
  const total = pageResults?.count[0]?.total || 0;
  const items = pageResults?.items || [];
  const [completedPayments, outstandingDues] = await Promise.all([
    Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    MaintenanceDue.aggregate([
      { $match: { status: { $in: ['pending', 'partially_paid'] } } },
      { $group: { _id: null, total: { $sum: { $subtract: [{ $add: ['$amount', '$penalty'] }, '$paidAmount'] } } } },
    ]),
  ]);
  const paid = completedPayments[0]?.total || 0;
  const outstanding = outstandingDues[0]?.total || 0;
  return {
    stats: {
      totalIncome: incomeTotal[0]?.total || 0,
      totalExpenses: expenseTotal[0]?.total || 0,
      availableFunds: (incomeTotal[0]?.total || 0) - (expenseTotal[0]?.total || 0),
      collectionRate: paid + outstanding ? Math.round((paid / (paid + outstanding)) * 100) : 0,
    },
    items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const getFinancialReports = async () => {
  const [monthlyIncome, expenseBreakdown, detailedIncome, detailedExpenses, totals] = await Promise.all([
    Income.aggregate([
      { $group: { _id: { year: { $year: '$date' }, month: { $month: '$date' } }, amount: { $sum: '$amount' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]),
    Expense.aggregate([
      { $match: { paymentStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: '$category', amount: { $sum: '$amount' } } },
      { $sort: { amount: -1 } },
    ]),
    Income.find().populate('resident', 'profile.name profile.flatNo profile.wing').sort({ date: -1 }).limit(500).lean(),
    Expense.find({ paymentStatus: { $ne: 'Cancelled' } }).sort({ date: -1 }).limit(500).lean(),
    Promise.all([
      Income.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      Expense.aggregate([{ $match: { paymentStatus: { $ne: 'Cancelled' } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      MaintenanceDue.aggregate([{ $match: { status: { $in: ['pending', 'partially_paid'] } } }, { $group: { _id: null, total: { $sum: { $subtract: [{ $add: ['$amount', '$penalty'] }, '$paidAmount'] } } } }]),
    ]),
  ]);
  const [incomeTotal, expensesTotal, pendingDues] = totals;
  const totalExpenses = expensesTotal[0]?.total || 0;
  const monthlyMap = new Map(monthlyIncome.map((item) => {
    const key = `${item._id.year}-${item._id.month}`;
    return [key, {
      month: new Date(item._id.year, item._id.month - 1, 1).toLocaleString('en-IN', { month: 'short', year: '2-digit' }),
      income: item.amount,
      expenses: 0,
    }];
  }));
  const monthlyExpenses = await Expense.aggregate([
    { $match: { paymentStatus: { $ne: 'Cancelled' } } },
    { $group: { _id: { year: { $year: '$date' }, month: { $month: '$date' } }, amount: { $sum: '$amount' } } },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);
  for (const item of monthlyExpenses) {
    const key = `${item._id.year}-${item._id.month}`;
    const row = monthlyMap.get(key);
    if (row) row.expenses = item.amount;
    else {
      monthlyMap.set(key, {
        month: new Date(item._id.year, item._id.month - 1, 1).toLocaleString('en-IN', { month: 'short', year: '2-digit' }),
        income: 0,
        expenses: item.amount,
      });
    }
  }
  const detailedTransactions = [
    ...detailedIncome.map((item) => ({
      id: item.id,
      date: item.date,
      reference: item.transactionRef,
      description: item.description,
      category: item.category,
      income: item.amount,
      expense: 0,
      resident: item.resident?.profile?.name || '',
      flat: [item.resident?.profile?.wing, item.resident?.profile?.flatNo].filter(Boolean).join('-'),
    })),
    ...detailedExpenses.map((item) => ({
      id: item.id,
      date: item.date,
      reference: item.transactionRef,
      description: item.description,
      category: item.category,
      income: 0,
      expense: item.amount,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    summary: {
      totalIncome: incomeTotal[0]?.total || 0,
      totalExpenses,
      surplus: (incomeTotal[0]?.total || 0) - totalExpenses,
      pendingDues: pendingDues[0]?.total || 0,
      period: 'All time',
    },
    monthlyData: [...monthlyMap.values()].sort((a, b) => a.month.localeCompare(b.month)),
    expenseBreakdown: expenseBreakdown.map((item) => ({
      category: item._id,
      amount: item.amount,
      percentage: totalExpenses ? (item.amount / totalExpenses) * 100 : 0,
    })),
    detailedTransactions,
  };
};
