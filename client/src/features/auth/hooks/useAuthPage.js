import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser, saveResidentAccountProfile } from '../services/authService';
import { getApiErrorMessage, hasAuthToken } from '../../../services/api/http';

const headings = {
  roleSelection: 'Welcome to SocietyVault',
  login: 'Welcome back',
  residentSignup: 'Create your resident account',
  signup: 'Create account',
  residentDetails: 'Your resident details',
};

const useAuthPage = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('roleSelection');
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(hasAuthToken);
  const [restoreError, setRestoreError] = useState('');
  useEffect(() => {
    if (!hasAuthToken()) return undefined;

    let active = true;
    getCurrentUser()
      .then((user) => {
        if (!active || !user) return;
        if (user.role !== 'resident' && user.role !== 'admin') {
          throw new Error('The saved account session is invalid. Sign in again to continue.');
        }
        setActiveUser(user);
        setSelectedRole(user.role);
        if (user.role === 'resident' && (!user.profileComplete || !user.profile)) {
          setActiveView('residentDetails');
        } else {
          navigate(user.role === 'resident' ? '/resident' : '/dashboard', { replace: true });
        }
      })
      .catch((sessionError) => {
        if (active) setRestoreError(getApiErrorMessage(sessionError, 'Session restore'));
      })
      .finally(() => {
        if (active) setIsCheckingSession(false);
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleRoleSelection = (role) => {
    setRestoreError('');
    setSelectedRole(role);
    setActiveView('login');
  };

  const handleBackToRoleSelection = () => {
    setActiveView('roleSelection');
    setSelectedRole(null);
  };

  const dismissRestoreError = () => setRestoreError('');

  const handleAuthenticated = (user) => {
    setRestoreError('');
    setActiveUser(user);
    if (user.role === 'resident') {
      if (user.profileComplete && user.profile) {
        navigate('/resident', { replace: true });
        return;
      }
      setActiveView('residentDetails');
      return;
    }

    navigate('/dashboard', { replace: true });
  };

  const handleResidentRegistration = (user) => {
    setSelectedRole('resident');
    handleAuthenticated(user);
  };

  const handleResidentProfileComplete = async (profile) => {
    if (!activeUser?.email) {
      throw new Error('Your session has expired. Sign in again to continue.');
    }
    const user = await saveResidentAccountProfile(activeUser.email, profile);
    setActiveUser(user);
    navigate('/resident', { replace: true });
  };

  const handleSignOutFromProfileSetup = async () => {
    await logoutUser();
    setActiveUser(null);
    setRestoreError('');
    handleBackToRoleSelection();
  };

  const getSubtitle = () => {
    switch (activeView) {
      case 'roleSelection':
        return 'Select your role to continue';
      case 'login':
        return `Sign in as ${selectedRole === 'admin' ? 'Administrator' : 'Resident'}`;
      case 'residentSignup':
        return 'Start with email and password, or continue with Google. Add your details next.';
      case 'signup':
        return `Create ${selectedRole === 'admin' ? 'Administrator' : 'Resident'} account`;
      case 'residentDetails':
        return 'Add the contact and flat details needed for your profile.';
      default:
        return 'Select your role to continue';
    }
  };

  return {
    activeView,
    setActiveView,
    selectedRole,
    activeUser,
    isCheckingSession,
    restoreError,
    dismissRestoreError,
    heading: headings[activeView] || headings.roleSelection,
    subtitle: getSubtitle(),
    handleRoleSelection,
    handleBackToRoleSelection,
    handleAuthenticated,
    handleResidentRegistration,
    handleResidentProfileComplete,
    handleSignOutFromProfileSetup,
  };
};

export default useAuthPage;
