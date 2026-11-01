import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const pageInfo = [
  { match: (path) => path === '/dashboard' || path === '/dashboard/', title: 'Dashboard', subtitle: 'Your financial overview.' },
  { match: (path) => path.includes('/income'), title: 'Income Management', subtitle: 'Track and manage all income transactions.' },
  { match: (path) => path.includes('/expenses'), title: 'Expense Management', subtitle: 'Track and manage all expense transactions.' },
  { match: (path) => path.includes('/residents'), title: 'Residents Management', subtitle: 'Manage residents, flats, and maintenance dues.' },
  { match: (path) => path.includes('/reports'), title: 'Financial Reports', subtitle: 'Generate and export comprehensive reports.' },
  { match: (path) => path.includes('/audit'), title: 'Audit Logs', subtitle: 'Track all system activities and changes.' },
  { match: (path) => path.includes('/settings'), title: 'Settings', subtitle: 'Configure system settings and preferences.' },
  { match: (path) => path.includes('/profile'), title: 'My Profile', subtitle: 'Manage your administrator account details.' },
];

const useDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [triggerAddIncome, setTriggerAddIncome] = useState(0);
  const [triggerAddExpense, setTriggerAddExpense] = useState(0);
  const { pathname } = useLocation();
  const currentPage = pageInfo.find(({ match }) => match(pathname)) || pageInfo[0];

  return {
    sidebarOpen,
    mobileSidebarOpen,
    title: currentPage.title,
    subtitle: currentPage.subtitle,
    closeMobileSidebar: () => setMobileSidebarOpen(false),
    toggleSidebar: () => setSidebarOpen((isOpen) => !isOpen),
    toggleMobileSidebar: () => setMobileSidebarOpen((isOpen) => !isOpen),
    triggerAddIncome,
    triggerAddExpense,
    requestAddIncome: () => setTriggerAddIncome((count) => count + 1),
    requestAddExpense: () => setTriggerAddExpense((count) => count + 1),
  };
};

export default useDashboardLayout;
