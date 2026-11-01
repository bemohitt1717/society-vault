// Mock data for dashboard - Replace with actual API calls later

export const chartData = [
  { month: 'May', income: 125000, expenses: 98000 },
  { month: 'Jun', income: 142000, expenses: 105000 },
  { month: 'Jul', income: 135000, expenses: 112000 },
  { month: 'Aug', income: 148000, expenses: 108000 },
  { month: 'Sep', income: 152000, expenses: 115000 },
  { month: 'Oct', income: 158000, expenses: 122000 },
];

export const recentTransactions = [
  {
    id: 1,
    date: '2026-10-15',
    description: 'Maintenance Collection - Oct 2026',
    category: 'Maintenance',
    type: 'income',
    amount: 45000,
  },
  {
    id: 2,
    date: '2026-10-14',
    description: 'Security Service Payment',
    category: 'Security',
    type: 'expense',
    amount: 28000,
  },
  {
    id: 3,
    date: '2026-10-12',
    description: 'Parking Fee Collection',
    category: 'Parking',
    type: 'income',
    amount: 8500,
  },
  {
    id: 4,
    date: '2026-10-10',
    description: 'Elevator Maintenance',
    category: 'Maintenance',
    type: 'expense',
    amount: 15000,
  },
  {
    id: 5,
    date: '2026-10-08',
    description: 'Utility Bills Payment',
    category: 'Utilities',
    type: 'expense',
    amount: 12500,
  },
];

export const statsData = {
  availableFunds: 485000,
  totalIncome: 158000,
  totalExpenses: 122000,
  pendingDues: 67500,
  trends: {
    availableFunds: { direction: 'up', value: '+8.2%' },
    totalIncome: { direction: 'up', value: '+12.5%' },
    totalExpenses: { direction: 'up', value: '+6.1%' },
    pendingDues: { direction: 'down', value: '-15.3%' },
  },
};
