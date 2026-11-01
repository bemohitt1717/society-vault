// Mock data for Resident Dashboard

// Resident profile information
export const residentProfile = {
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@email.com',
  phone: '+91 98765 43210',
  flatNo: 'A-101',
  wing: 'A',
};

// Resident KPI stats
export const residentStats = {
  myDueAmount: 15000,
  paidThisMonth: 12000,
  totalPaidYear: 144000,
  pendingReceipts: 2
};

// Current dues breakdown
export const currentDues = [
  {
    id: 'DUE-001',
    month: 'October 2026',
    category: 'Maintenance',
    amount: 12000,
    dueDate: '2026-10-05',
    status: 'pending',
    penalty: 0
  },
  {
    id: 'DUE-002',
    month: 'October 2026',
    category: 'Water Charges',
    amount: 2000,
    dueDate: '2026-10-10',
    status: 'pending',
    penalty: 0
  },
  {
    id: 'DUE-003',
    month: 'October 2026',
    category: 'Parking Fee',
    amount: 1000,
    dueDate: '2026-10-10',
    status: 'pending',
    penalty: 0
  }
];

// Payment history
export const paymentHistory = [
  {
    id: 'PAY-001',
    date: '2026-09-05',
    month: 'September 2026',
    category: 'Maintenance',
    amount: 12000,
    paymentMode: 'UPI',
    transactionId: 'TXN123456789',
    status: 'completed',
    receiptNo: 'REC-SEP-001'
  },
  {
    id: 'PAY-002',
    date: '2026-09-05',
    month: 'September 2026',
    category: 'Water Charges',
    amount: 2000,
    paymentMode: 'UPI',
    transactionId: 'TXN123456790',
    status: 'completed',
    receiptNo: 'REC-SEP-002'
  },
  {
    id: 'PAY-003',
    date: '2026-08-04',
    month: 'August 2026',
    category: 'Maintenance',
    amount: 12000,
    paymentMode: 'Bank Transfer',
    transactionId: 'TXN123456701',
    status: 'completed',
    receiptNo: 'REC-AUG-001'
  },
  {
    id: 'PAY-004',
    date: '2026-08-04',
    month: 'August 2026',
    category: 'Water Charges',
    amount: 2000,
    paymentMode: 'Bank Transfer',
    transactionId: 'TXN123456702',
    status: 'completed',
    receiptNo: 'REC-AUG-002'
  },
  {
    id: 'PAY-005',
    date: '2026-07-03',
    month: 'July 2026',
    category: 'Maintenance',
    amount: 12000,
    paymentMode: 'Cash',
    transactionId: null,
    status: 'completed',
    receiptNo: 'REC-JUL-001'
  },
  {
    id: 'PAY-006',
    date: '2026-07-03',
    month: 'July 2026',
    category: 'Water Charges',
    amount: 2000,
    paymentMode: 'Cash',
    transactionId: null,
    status: 'completed',
    receiptNo: 'REC-JUL-002'
  }
];

// Receipts
export const receipts = [
  {
    id: 'REC-SEP-001',
    month: 'September 2026',
    date: '2026-09-05',
    amount: 12000,
    category: 'Maintenance',
    paymentMode: 'UPI',
    status: 'generated'
  },
  {
    id: 'REC-SEP-002',
    month: 'September 2026',
    date: '2026-09-05',
    amount: 2000,
    category: 'Water Charges',
    paymentMode: 'UPI',
    status: 'generated'
  },
  {
    id: 'REC-AUG-001',
    month: 'August 2026',
    date: '2026-08-04',
    amount: 12000,
    category: 'Maintenance',
    paymentMode: 'Bank Transfer',
    status: 'generated'
  },
  {
    id: 'REC-AUG-002',
    month: 'August 2026',
    date: '2026-08-04',
    amount: 2000,
    category: 'Water Charges',
    paymentMode: 'Bank Transfer',
    status: 'generated'
  }
];

// Society finances (read-only view for transparency)
export const societyFinances = {
  stats: {
    totalIncome: 2450000,
    totalExpenses: 1850000,
    availableFunds: 600000,
    collectionRate: 92
  },
  recentTransactions: [
    {
      id: 'SOC-001',
      date: '2026-10-10',
      type: 'income',
      category: 'Maintenance Collection',
      description: 'Monthly maintenance - October 2026',
      amount: 450000,
      status: 'completed'
    },
    {
      id: 'SOC-002',
      date: '2026-10-08',
      type: 'expense',
      category: 'Utilities',
      description: 'Electricity bill - Common areas',
      amount: 35000,
      status: 'completed'
    },
    {
      id: 'SOC-003',
      date: '2026-10-05',
      type: 'expense',
      category: 'Maintenance',
      description: 'Lift maintenance - All lifts',
      amount: 25000,
      status: 'completed'
    },
    {
      id: 'SOC-004',
      date: '2026-09-28',
      type: 'income',
      category: 'Parking Fee',
      description: 'Visitor parking charges',
      amount: 8500,
      status: 'completed'
    },
    {
      id: 'SOC-005',
      date: '2026-09-25',
      type: 'expense',
      category: 'Staff Salary',
      description: 'Security staff salary - September',
      amount: 85000,
      status: 'completed'
    }
  ]
};

// Upcoming maintenance schedule
export const upcomingMaintenance = [
  {
    id: 'MAINT-001',
    title: 'Lift Maintenance',
    date: '2026-10-15',
    time: '10:00 AM',
    description: 'Quarterly lift maintenance - All lifts'
  },
  {
    id: 'MAINT-002',
    title: 'Water Tank Cleaning',
    date: '2026-10-20',
    time: '8:00 AM',
    description: 'Overhead water tank cleaning'
  },
  {
    id: 'MAINT-003',
    title: 'Pest Control',
    date: '2026-10-25',
    time: '2:00 PM',
    description: 'Common area pest control'
  }
];

// Payment categories
export const paymentCategories = [
  'Maintenance',
  'Water Charges',
  'Parking Fee',
  'Penalty',
  'Special Assessment',
  'Other'
];

// Payment modes
export const paymentModes = [
  'UPI',
  'Bank Transfer',
  'Cash',
  'Cheque',
  'Online'
];

// Payment status options
export const paymentStatuses = [
  'pending',
  'completed',
  'failed',
  'processing'
];
