import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const pageInfo = [
  { match: (path) => path === '/resident' || path === '/resident/', title: 'Dashboard', subtitle: 'Welcome to your personal dashboard.' },
  { match: (path) => path.includes('/payments'), title: 'My Payments', subtitle: 'Track dues, payment history, and download receipts.' },
  { match: (path) => path.includes('/finances'), title: 'Society Finances', subtitle: 'View society income, expenses, and financial transparency.' },
  { match: (path) => path.includes('/reports'), title: 'Reports & Statements', subtitle: 'Generate payment statements and download reports.' },
  { match: (path) => path.includes('/profile'), title: 'My Profile', subtitle: 'View your resident and household information.' },
];

const useResidentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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
  };
};

export default useResidentLayout;
