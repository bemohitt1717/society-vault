export const reportSummary = {
  totalIncome: 1250000,
  totalExpenses: 580000,
  surplus: 670000,
  pendingDues: 125000,
  period: 'October 2026'
};

export const monthlyData = [
  { month: 'Apr', income: 980000, expenses: 420000 },
  { month: 'May', income: 1050000, expenses: 480000 },
  { month: 'Jun', income: 1120000, expenses: 510000 },
  { month: 'Jul', income: 1080000, expenses: 490000 },
  { month: 'Aug', income: 1150000, expenses: 540000 },
  { month: 'Sep', income: 1200000, expenses: 560000 },
  { month: 'Oct', income: 1250000, expenses: 580000 }
];

export const expenseBreakdown = [
  { category: 'Utilities', amount: 125000, percentage: 21.6, color: '#b59a72' },
  { category: 'Staff Salaries', amount: 185000, percentage: 31.9, color: '#8b829f' },
  { category: 'Maintenance', amount: 145000, percentage: 25.0, color: '#b77e7e' },
  { category: 'Security', amount: 85000, percentage: 14.7, color: '#7890a0' },
  { category: 'Others', amount: 40000, percentage: 6.8, color: '#789b89' }
];

export const detailedTransactions = [
  { date: '2026-10-10', reference: 'INC-001', description: 'Maintenance Charges', category: 'Income', income: 35000, expense: 0 },
  { date: '2026-10-10', reference: 'EXP-001', description: 'Elevator Maintenance', category: 'Maintenance', income: 0, expense: 45000 },
  { date: '2026-10-09', reference: 'INC-002', description: 'Parking Fee', category: 'Income', income: 2000, expense: 0 },
  { date: '2026-10-09', reference: 'EXP-002', description: 'Electricity Bill', category: 'Utilities', income: 0, expense: 125000 },
  { date: '2026-10-08', reference: 'INC-003', description: 'Late Payment Penalty', category: 'Income', income: 500, expense: 0 },
  { date: '2026-10-08', reference: 'EXP-003', description: 'Security Staff Salary', category: 'Staff', income: 0, expense: 85000 },
  { date: '2026-10-07', reference: 'INC-004', description: 'Community Hall Booking', category: 'Income', income: 5000, expense: 0 },
  { date: '2026-10-07', reference: 'EXP-004', description: 'Water Pump Repair', category: 'Maintenance', income: 0, expense: 8500 }
];

export const periodOptions = ['Monthly', 'Quarterly', 'Yearly', 'Custom Range'];
