export const expenseStats = {
  totalExpenses: 580000,
  transactionCount: 24,
  topCategory: 'Maintenance & Repairs'
};

export const expenseCategories = [
  { id: 1, name: 'Maintenance & Repairs', color: '#ff6b6b' },
  { id: 2, name: 'Utilities', color: '#ffa500' },
  { id: 3, name: 'Staff Salaries', color: '#7f5af0' },
  { id: 4, name: 'Security Services', color: '#00d4ff' },
  { id: 5, name: 'Cleaning Services', color: '#2cb67d' },
  { id: 6, name: 'Administrative', color: '#94a1b2' },
  { id: 7, name: 'Insurance', color: '#ff88aa' },
  { id: 8, name: 'Other Expenses', color: '#66bb6a' }
];

export const paymentStatuses = ['Paid', 'Pending', 'Overdue', 'Cancelled'];
export const paymentModes = ['Cash', 'Bank Transfer', 'UPI', 'Cheque', 'Card'];

export const expenseTransactions = [
  {
    id: 'EXP-001',
    date: '2026-10-10',
    description: 'Elevator Maintenance',
    category: 'Maintenance & Repairs',
    vendor: 'Otis Elevators Pvt Ltd',
    paymentStatus: 'Paid',
    amount: 45000,
    paymentMode: 'Bank Transfer',
    transactionRef: 'TXN123456789',
    hasInvoice: true
  },
  {
    id: 'EXP-002',
    date: '2026-10-09',
    description: 'Electricity Bill - September',
    category: 'Utilities',
    vendor: 'State Electricity Board',
    paymentStatus: 'Paid',
    amount: 125000,
    paymentMode: 'Bank Transfer',
    transactionRef: 'TXN123456790',
    hasInvoice: true
  },
  {
    id: 'EXP-003',
    date: '2026-10-08',
    description: 'Security Staff Salary - Oct',
    category: 'Staff Salaries',
    vendor: 'Security Services Co.',
    paymentStatus: 'Paid',
    amount: 85000,
    paymentMode: 'Bank Transfer',
    transactionRef: 'TXN123456791',
    hasInvoice: false
  },
  {
    id: 'EXP-004',
    date: '2026-10-07',
    description: 'Water Pump Repair',
    category: 'Maintenance & Repairs',
    vendor: 'Kumar Plumbing Works',
    paymentStatus: 'Pending',
    amount: 8500,
    paymentMode: 'Cash',
    transactionRef: 'CASH-002',
    hasInvoice: true
  },
  {
    id: 'EXP-005',
    date: '2026-10-06',
    description: 'Cleaning Service - October',
    category: 'Cleaning Services',
    vendor: 'CleanPro Services',
    paymentStatus: 'Paid',
    amount: 22000,
    paymentMode: 'UPI',
    transactionRef: 'UPI202610061234',
    hasInvoice: true
  },
  {
    id: 'EXP-006',
    date: '2026-10-05',
    description: 'Office Supplies',
    category: 'Administrative',
    vendor: 'Office Mart',
    paymentStatus: 'Paid',
    amount: 3500,
    paymentMode: 'Card',
    transactionRef: 'CARD789123',
    hasInvoice: true
  },
  {
    id: 'EXP-007',
    date: '2026-10-04',
    description: 'Fire Insurance Premium - Q4',
    category: 'Insurance',
    vendor: 'National Insurance Co.',
    paymentStatus: 'Pending',
    amount: 75000,
    paymentMode: 'Bank Transfer',
    transactionRef: '',
    hasInvoice: true
  },
  {
    id: 'EXP-008',
    date: '2026-10-03',
    description: 'Garden Maintenance',
    category: 'Maintenance & Repairs',
    vendor: 'Green Landscaping',
    paymentStatus: 'Paid',
    amount: 12000,
    paymentMode: 'UPI',
    transactionRef: 'UPI202610031234',
    hasInvoice: false
  }
];
