export const auditLogs = [
  {
    id: 'AUD-001',
    timestamp: '2026-10-12T14:32:45',
    user: 'Admin User',
    action: 'Created',
    module: 'Income',
    record: 'INC-008',
    description: 'Created new income transaction'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-10-12T13:15:22',
    user: 'Admin User',
    action: 'Updated',
    module: 'Expense',
    record: 'EXP-004',
    description: 'Updated payment status to Paid'
  },
  {
    id: 'AUD-003',
    timestamp: '2026-10-12T11:45:10',
    user: 'Manager User',
    action: 'Deleted',
    module: 'Resident',
    record: 'RES-015',
    description: 'Removed resident record'
  },
  {
    id: 'AUD-004',
    timestamp: '2026-10-12T10:20:33',
    user: 'Admin User',
    action: 'Created',
    module: 'Maintenance',
    record: 'MAINT-102',
    description: 'Generated maintenance bills for October'
  },
  {
    id: 'AUD-005',
    timestamp: '2026-10-11T16:55:12',
    user: 'Admin User',
    action: 'Updated',
    module: 'Settings',
    record: 'SET-001',
    description: 'Updated society contact details'
  },
  {
    id: 'AUD-006',
    timestamp: '2026-10-11T15:30:45',
    user: 'Accountant User',
    action: 'Exported',
    module: 'Reports',
    record: 'REP-Q3-2026',
    description: 'Exported Q3 financial report'
  },
  {
    id: 'AUD-007',
    timestamp: '2026-10-11T14:10:20',
    user: 'Admin User',
    action: 'Created',
    module: 'User',
    record: 'USR-008',
    description: 'Added new user account'
  },
  {
    id: 'AUD-008',
    timestamp: '2026-10-11T12:40:15',
    user: 'Manager User',
    action: 'Updated',
    module: 'Income',
    record: 'INC-005',
    description: 'Updated transaction reference number'
  }
];

export const actionTypes = ['Created', 'Updated', 'Deleted', 'Exported', 'Login', 'Logout'];
export const modules = ['Income', 'Expense', 'Resident', 'Maintenance', 'Reports', 'Settings', 'User'];
