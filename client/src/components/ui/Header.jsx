import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, ChevronDown, User, LogOut, Plus, TrendingUp, TrendingDown, Settings } from 'lucide-react';
import { logoutUser } from '../../features/auth/services/authService';
import { getCurrentUser } from '../../services/api/authApi';
import { getApiErrorMessage, logApiError } from '../../services/api/http';
import ConfirmDialog from './ConfirmDialog';

// ── Morphing sidebar toggle icon ──────────────────────────────────────────────
const OUTER =
  'M11 3H13C16.7712 3 18.6569 3 19.8284 4.17157C21 5.34315 21 7.22876 21 11V13C21 16.7712 21 18.6569 19.8284 19.8284C18.6569 21 16.7712 21 13 21H11C7.2288 21 5.3431 21 4.1716 19.8284C3 18.6569 3 16.7712 3 13V11C3 7.22876 3 5.34315 4.1716 4.17157C5.3431 3 7.2288 3 11 3Z';
const PANEL_CLOSED =
  'M10 5.5C10 4.793 10 4.439 9.780 4.220C9.560 4 9.207 4 8.5 4H8.5C6.379 4 5.318 4 4.659 4.659C4 5.318 4 6.379 4 8.5V15.5C4 17.621 4 18.682 4.659 19.341C5.318 20 6.379 20 8.5 20H8.5C9.207 20 9.561 20 9.780 19.780C10 19.561 10 19.207 10 18.5V5.5Z';
const PANEL_OPEN =
  'M14 6C14 5.057 14 4.586 13.707 4.293C13.414 4 12.943 4 12 4H10C7.172 4 5.757 4 4.879 4.879C4 5.757 4 7.172 4 10V14C4 16.828 4 18.243 4.879 19.121C5.757 20 7.172 20 10 20H12C12.943 20 13.414 20 13.707 19.707C14 19.414 14 18.943 14 18V6Z';

const SidebarToggleIcon = ({ isOpen }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d={OUTER}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <motion.path
      animate={{ d: isOpen ? PANEL_OPEN : PANEL_CLOSED }}
      style={{ fill: '#16161a' }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    />
  </svg>
);
// ─────────────────────────────────────────────────────────────────────────────

const Header = ({
  title,
  subtitle,
  sidebarOpen,
  mobileSidebarOpen,
  onToggleSidebar,
  onMobileToggle,
  onAddIncome,
  onAddExpense,
  isResidentPortal = false, // Flag to identify resident portal
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [residentName, setResidentName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const addMenuRef     = useRef(null);
  const profileMenuRef = useRef(null);

  const handleLogout = useCallback(async () => {
    setLogoutError('');
    setIsLoggingOut(true);
    try {
      await logoutUser();
      setLogoutConfirmOpen(false);
      navigate('/', { replace: true });
    } catch (error) {
      setLogoutError(getApiErrorMessage(error));
    } finally {
      setIsLoggingOut(false);
    }
  }, [navigate]);

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then((user) => {
        if (!active) return;
        if (isResidentPortal) {
          setResidentName(user?.profile?.name || user?.name || '');
        } else {
          setAdminName(user?.name || '');
        }
      })
      .catch((error) => {
        logApiError(error, `Header ${isResidentPortal ? 'resident' : 'administrator'} profile`);
      });
    return () => {
      active = false;
    };
  }, [isResidentPortal, location.pathname]);

  useEffect(() => {
    const handleProfileUpdated = (event) => {
      if (event.detail?.role === 'admin') setAdminName(event.detail.name || '');
    };
    window.addEventListener('societyvault:profile-updated', handleProfileUpdated);
    return () => window.removeEventListener('societyvault:profile-updated', handleProfileUpdated);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (addMenuRef.current     && !addMenuRef.current.contains(e.target))     setShowAddMenu(false);
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="bg-[#16161a] border-b border-[#2e2f33] px-3 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2 min-w-0 h-[60px] md:h-[72px]">

      {/* ── Left ── */}
      <div className="flex items-center gap-2 md:gap-4 min-w-0">

        {/* Desktop toggle */}
        <button
          onClick={onToggleSidebar}
          className="hidden lg:flex items-center justify-center flex-shrink-0 text-[#94a1b2] hover:text-[#fffffe] hover:bg-[#242629] transition-colors cursor-pointer w-9 h-9 rounded-lg"
          title="Toggle sidebar"
        >
          <SidebarToggleIcon isOpen={sidebarOpen} />
        </button>

        {/* Mobile toggle — same icon, controls overlay sidebar */}
        <button
          onClick={onMobileToggle}
          className="lg:hidden flex items-center justify-center flex-shrink-0 text-[#94a1b2] hover:text-[#fffffe] hover:bg-[#242629] transition-colors cursor-pointer w-9 h-9 rounded-lg"
          title="Toggle sidebar"
        >
          <SidebarToggleIcon isOpen={mobileSidebarOpen} />
        </button>

        {/* Title block — truncate to prevent overflow */}
        <div className="min-w-0">
          <h1 className="text-lg md:text-2xl font-bold text-[#fffffe] truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs md:text-sm text-[#94a1b2] truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {/* ── Right ── */}
      <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">

        {/* Quick Add - Only show for Admin Portal */}
        {!isResidentPortal && (
          <div className="relative" ref={addMenuRef}>
            <button
              onClick={() => setShowAddMenu(v => !v)}
              className="p-2 hover:bg-[#242629] rounded-lg transition-colors cursor-pointer"
              title="Quick Add"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5 text-[#94a1b2]" />
            </button>

          {showAddMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-[#1e1e22] border border-[#2e2f33] rounded-xl shadow-xl overflow-hidden z-50">
              <button
                onClick={() => {
                  setShowAddMenu(false);
                  if (location.pathname.includes('/income')) {
                    // If already on income page, trigger the callback
                    onAddIncome?.();
                  } else {
                    // Navigate to income page and set a flag to open dialog
                    navigate('/dashboard/income', { state: { openAddDialog: true } });
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#fffffe] hover:bg-[#242629] transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-md bg-[#8db5a2]/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-3.5 h-3.5 text-[#8db5a2]" strokeWidth={2} />
                </div>
                Add Income
              </button>
              <div className="h-px bg-[#2e2f33]" />
              <button
                onClick={() => {
                  setShowAddMenu(false);
                  if (location.pathname.includes('/expense')) {
                    onAddExpense?.();
                  } else {
                    navigate('/dashboard/expenses', { state: { openAddDialog: true } });
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#fffffe] hover:bg-[#242629] transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-md bg-[#c99393]/10 flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="w-3.5 h-3.5 text-[#c99393]" strokeWidth={2} />
                </div>
                Add Expense
              </button>
            </div>
          )}
          </div>
        )}

        {/* Notifications */}
        <button className="relative p-2 hover:bg-[#242629] rounded-lg transition-colors cursor-pointer">
          <Bell className="w-4 h-4 md:w-5 md:h-5 text-[#94a1b2]" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#7f5af0] rounded-full" />
        </button>

        {/* Profile */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu(v => !v)}
            className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 hover:bg-[#242629] rounded-lg transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 md:w-8 md:h-8 bg-[#7f5af0] rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-[#fffffe]">
                {isResidentPortal ? residentName || 'Resident' : adminName || 'Administrator'}
              </p>
              <p className="text-xs text-[#94a1b2]">{isResidentPortal ? 'Resident' : 'Administrator'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#94a1b2] hidden md:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1e1e22] border border-[#2e2f33] rounded-xl shadow-xl overflow-hidden z-50">
              {logoutError && (
                <p role="alert" className="px-4 py-3 text-xs text-[#f0b2b4]">{logoutError}</p>
              )}
              <button 
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate(isResidentPortal ? '/resident/profile' : '/dashboard/profile');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#fffffe] hover:bg-[#242629] transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4 text-[#94a1b2]" />
                My Profile
              </button>
              <div className="h-px bg-[#2e2f33]" />
              <button
                onClick={() => {
                  setLogoutError('');
                  setShowProfileMenu(false);
                  setLogoutConfirmOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#ff6b6b] hover:bg-[#242629] transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <ConfirmDialog
        isOpen={logoutConfirmOpen}
        title="Log out of SocietyVault?"
        description="You will need to sign in again to access your account."
        confirmLabel="Log out"
        error={logoutError}
        isLoading={isLoggingOut}
        onConfirm={handleLogout}
        onCancel={() => {
          setLogoutConfirmOpen(false);
          setLogoutError('');
        }}
      />
    </header>
  );
};

export default Header;
