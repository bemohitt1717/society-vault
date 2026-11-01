export const societyDetails = {
  name: 'Green Valley Apartments',
  address: '123 Park Avenue, Sector 21, Mumbai - 400001',
  email: 'admin@greenvalley.com',
  phone: '+91 98765 43210',
  registrationNumber: 'REG/2015/MH/12345'
};

export const categories = {
  income: [
    { id: 1, name: 'Maintenance Charges', active: true },
    { id: 2, name: 'Parking Fees', active: true },
    { id: 3, name: 'Late Payment Fees', active: true },
    { id: 4, name: 'Amenity Bookings', active: true },
    { id: 5, name: 'Other Income', active: true }
  ],
  expense: [
    { id: 1, name: 'Maintenance & Repairs', active: true },
    { id: 2, name: 'Utilities', active: true },
    { id: 3, name: 'Staff Salaries', active: true },
    { id: 4, name: 'Security Services', active: true },
    { id: 5, name: 'Cleaning Services', active: true },
    { id: 6, name: 'Administrative', active: true },
    { id: 7, name: 'Insurance', active: true }
  ]
};

export const financialSettings = {
  financialYear: '2026-2027',
  currency: 'INR',
  maintenanceAmount: 3500,
  dueDate: 5,
  lateFeePercentage: 2
};

export const users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@greenvalley.com',
    role: 'Administrator',
    status: 'Active',
    lastLogin: '2026-10-12T14:30:00'
  },
  {
    id: 2,
    name: 'Manager User',
    email: 'manager@greenvalley.com',
    role: 'Manager',
    status: 'Active',
    lastLogin: '2026-10-12T10:15:00'
  },
  {
    id: 3,
    name: 'Accountant User',
    email: 'accounts@greenvalley.com',
    role: 'Accountant',
    status: 'Active',
    lastLogin: '2026-10-11T16:45:00'
  },
  {
    id: 4,
    name: 'Viewer User',
    email: 'viewer@greenvalley.com',
    role: 'Viewer',
    status: 'Inactive',
    lastLogin: '2026-10-05T09:20:00'
  }
];

export const roles = ['Administrator', 'Manager', 'Accountant', 'Viewer'];
