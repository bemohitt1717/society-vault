export const incomeStats = {
  totalIncome: 1250000,
  transactionCount: 48,
  averageAmount: 26041,
  period: 'This Month'
};

export const incomeCategories = [
  { id: 1, name: 'Maintenance Charges', color: '#2cb67d' },
  { id: 2, name: 'Parking Fees', color: '#7f5af0' },
  { id: 3, name: 'Late Payment Fees', color: '#ffa500' },
  { id: 4, name: 'Amenity Bookings', color: '#00d4ff' },
  { id: 5, name: 'Other Income', color: '#94a1b2' }
];

export const paymentModes = ['Cash', 'Bank Transfer', 'UPI', 'Cheque', 'Card'];

export const incomeTransactions = [
  {
    id: 'INC-001',
    date: '2026-10-10',
    description: 'Monthly Maintenance - Oct 2026',
    category: 'Maintenance Charges',
    resident: 'Raj Kumar',
    flat: 'A-101',
    paymentMode: 'Bank Transfer',
    amount: 35000,
    transactionRef: 'TXN789456123'
  },
  {
    id: 'INC-002',
    date: '2026-10-09',
    description: 'Parking Fee - October',
    category: 'Parking Fees',
    resident: 'Priya Sharma',
    flat: 'B-205',
    paymentMode: 'UPI',
    amount: 2000,
    transactionRef: 'UPI202610091234'
  },
  {
    id: 'INC-003',
    date: '2026-10-08',
    description: 'Late Payment Penalty',
    category: 'Late Payment Fees',
    resident: 'Amit Patel',
    flat: 'C-304',
    paymentMode: 'Cash',
    amount: 500,
    transactionRef: 'CASH-001'
  },
  {
    id: 'INC-004',
    date: '2026-10-07',
    description: 'Community Hall Booking',
    category: 'Amenity Bookings',
    resident: 'Sneha Gupta',
    flat: 'A-203',
    paymentMode: 'Bank Transfer',
    amount: 5000,
    transactionRef: 'TXN789456124'
  },
  {
    id: 'INC-005',
    date: '2026-10-06',
    description: 'Monthly Maintenance - Oct 2026',
    category: 'Maintenance Charges',
    resident: 'Vikram Singh',
    flat: 'B-102',
    paymentMode: 'UPI',
    amount: 35000,
    transactionRef: 'UPI202610061234'
  },
  {
    id: 'INC-006',
    date: '2026-10-05',
    description: 'Gym Membership - Q4',
    category: 'Amenity Bookings',
    resident: 'Neha Verma',
    flat: 'C-401',
    paymentMode: 'Card',
    amount: 3000,
    transactionRef: 'CARD456789'
  },
  {
    id: 'INC-007',
    date: '2026-10-04',
    description: 'Monthly Maintenance - Oct 2026',
    category: 'Maintenance Charges',
    resident: 'Rahul Mehta',
    flat: 'A-305',
    paymentMode: 'Bank Transfer',
    amount: 35000,
    transactionRef: 'TXN789456125'
  },
  {
    id: 'INC-008',
    date: '2026-10-03',
    description: 'Swimming Pool Access Fee',
    category: 'Amenity Bookings',
    resident: 'Kavita Reddy',
    flat: 'B-303',
    paymentMode: 'UPI',
    amount: 1500,
    transactionRef: 'UPI202610031234'
  }
];
