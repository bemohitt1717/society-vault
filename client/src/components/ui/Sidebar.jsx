import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  History,
  Settings,
  Building2,
} from 'lucide-react';
import logoImage from '../../assets/logo.png';

const Sidebar = ({ isOpen = true }) => {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard',  path: '/dashboard' },
    { icon: TrendingUp,      label: 'Income',     path: '/dashboard/income' },
    { icon: TrendingDown,    label: 'Expenses',   path: '/dashboard/expenses' },
    { icon: Users,           label: 'Residents',  path: '/dashboard/residents' },
    { icon: FileText,        label: 'Reports',    path: '/dashboard/reports' },
    { icon: History,         label: 'Audit Logs', path: '/dashboard/audit' },
    { icon: Settings,        label: 'Settings',   path: '/dashboard/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.aside
      className="flex flex-col bg-[#16161a] border-r border-[#2e2f33] h-screen fixed left-0 top-0 z-40 overflow-hidden"
      animate={{ width: isOpen ? 200 : 56 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-[#2e2f33] overflow-hidden">
        <img src={logoImage} alt="SocietyVault" className="h-8 w-8 flex-shrink-0" />
        <motion.span
          className="text-[#fffffe] text-lg font-semibold ml-3 whitespace-nowrap overflow-hidden"
          animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? 'auto' : 0 }}
          transition={{ duration: 0.2 }}
        >
          SocietyVault
        </motion.span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              title={!isOpen ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                active
                  ? 'bg-[#7f5af0] text-white'
                  : 'text-[#94a1b2] hover:bg-[#242629] hover:text-[#fffffe]'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <motion.span
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
                animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? 'auto' : 0 }}
                transition={{ duration: 0.2 }}
              >
                {item.label}
              </motion.span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[#2e2f33] overflow-hidden">
        <div className="flex items-center gap-3 text-sm text-[#94a1b2]">
          <Building2 className="w-4 h-4 flex-shrink-0" />
          <motion.span
            className="whitespace-nowrap overflow-hidden"
            animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? 'auto' : 0 }}
            transition={{ duration: 0.2 }}
          >
            Admin Panel
          </motion.span>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
