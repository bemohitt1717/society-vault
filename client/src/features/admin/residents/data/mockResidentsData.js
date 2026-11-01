export const residents = [
  {
    id: 'RES-001',
    name: 'Raj Kumar',
    flat: 'A-101',
    type: 'Owner',
    contact: '+91 98765 43210',
    email: 'raj.kumar@email.com',
    maintenanceAmount: 3500,
    outstanding: 0,
    status: 'Active'
  },
  {
    id: 'RES-002',
    name: 'Priya Sharma',
    flat: 'B-205',
    type: 'Owner',
    contact: '+91 98765 43211',
    email: 'priya.sharma@email.com',
    maintenanceAmount: 3500,
    outstanding: 3500,
    status: 'Active'
  },
  {
    id: 'RES-003',
    name: 'Amit Patel',
    flat: 'C-304',
    type: 'Tenant',
    contact: '+91 98765 43212',
    email: 'amit.patel@email.com',
    maintenanceAmount: 3500,
    outstanding: 7000,
    status: 'Active'
  },
  {
    id: 'RES-004',
    name: 'Sneha Gupta',
    flat: 'A-203',
    type: 'Owner',
    contact: '+91 98765 43213',
    email: 'sneha.gupta@email.com',
    maintenanceAmount: 3500,
    outstanding: 0,
    status: 'Active'
  },
  {
    id: 'RES-005',
    name: 'Vikram Singh',
    flat: 'B-102',
    type: 'Owner',
    contact: '+91 98765 43214',
    email: 'vikram.singh@email.com',
    maintenanceAmount: 3500,
    outstanding: 0,
    status: 'Active'
  },
  {
    id: 'RES-006',
    name: 'Neha Verma',
    flat: 'C-401',
    type: 'Tenant',
    contact: '+91 98765 43215',
    email: 'neha.verma@email.com',
    maintenanceAmount: 3500,
    outstanding: 3500,
    status: 'Active'
  }
];

export const maintenanceDues = [
  {
    id: 'DUES-001',
    period: 'October 2026',
    flat: 'A-101',
    resident: 'Raj Kumar',
    amountDue: 3500,
    amountPaid: 3500,
    outstanding: 0,
    dueDate: '2026-10-05',
    status: 'Paid'
  },
  {
    id: 'DUES-002',
    period: 'October 2026',
    flat: 'B-205',
    resident: 'Priya Sharma',
    amountDue: 3500,
    amountPaid: 0,
    outstanding: 3500,
    dueDate: '2026-10-05',
    status: 'Pending'
  },
  {
    id: 'DUES-003',
    period: 'October 2026',
    flat: 'C-304',
    resident: 'Amit Patel',
    amountDue: 3500,
    amountPaid: 0,
    outstanding: 3500,
    dueDate: '2026-10-05',
    status: 'Overdue'
  },
  {
    id: 'DUES-004',
    period: 'September 2026',
    flat: 'C-304',
    resident: 'Amit Patel',
    amountDue: 3500,
    amountPaid: 0,
    outstanding: 3500,
    dueDate: '2026-09-05',
    status: 'Overdue'
  },
  {
    id: 'DUES-005',
    period: 'October 2026',
    flat: 'A-203',
    resident: 'Sneha Gupta',
    amountDue: 3500,
    amountPaid: 3500,
    outstanding: 0,
    dueDate: '2026-10-05',
    status: 'Paid'
  },
  {
    id: 'DUES-006',
    period: 'October 2026',
    flat: 'B-102',
    resident: 'Vikram Singh',
    amountDue: 3500,
    amountPaid: 3500,
    outstanding: 0,
    dueDate: '2026-10-05',
    status: 'Paid'
  }
];

export const paymentHistory = [
  {
    id: 'PAY-001',
    paymentDate: '2026-10-03',
    resident: 'Raj Kumar',
    flat: 'A-101',
    period: 'October 2026',
    amount: 3500,
    mode: 'Bank Transfer',
    reference: 'TXN789456123'
  },
  {
    id: 'PAY-002',
    paymentDate: '2026-10-04',
    resident: 'Sneha Gupta',
    flat: 'A-203',
    period: 'October 2026',
    amount: 3500,
    mode: 'UPI',
    reference: 'UPI202610041234'
  },
  {
    id: 'PAY-003',
    paymentDate: '2026-10-02',
    resident: 'Vikram Singh',
    flat: 'B-102',
    period: 'October 2026',
    amount: 3500,
    mode: 'Bank Transfer',
    reference: 'TXN789456124'
  },
  {
    id: 'PAY-004',
    paymentDate: '2026-09-05',
    resident: 'Raj Kumar',
    flat: 'A-101',
    period: 'September 2026',
    amount: 3500,
    mode: 'Cheque',
    reference: 'CHQ123456'
  },
  {
    id: 'PAY-005',
    paymentDate: '2026-09-07',
    resident: 'Neha Verma',
    flat: 'C-401',
    period: 'September 2026',
    amount: 3500,
    mode: 'Cash',
    reference: 'CASH-003'
  }
];

export const duesSummary = {
  totalOutstanding: 10500,
  overdueAmount: 7000,
  unpaidBills: 3
};
