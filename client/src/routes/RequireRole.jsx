import { useEffect, useState } from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../features/auth/services/authService';
import { getApiErrorMessage } from '../services/api/http';
import ErrorToast from '../components/ui/ErrorToast';
import LoadingState from '../components/ui/LoadingState';

const RequireRole = ({ role }) => {
  const [check, setCheck] = useState({ status: 'loading', user: null, error: '' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then((user) => {
        if (active) setCheck({ status: user ? 'ready' : 'unauthenticated', user, error: '' });
      })
      .catch((error) => {
        if (active) setCheck({ status: 'error', user: null, error: getApiErrorMessage(error, 'Session verification') });
      });

    return () => {
      active = false;
    };
  }, [attempt]);

  if (check.status === 'loading') {
    return <LoadingState label="Verifying your session..." className="min-h-screen" />;
  }
  if (check.status === 'error') {
    return (
      <main className="grid min-h-screen place-items-center bg-[#16161a] px-6 text-center">
        <div>
          <ErrorToast
            message={check.error}
            onDismiss={() => setCheck((current) => ({ ...current, error: '' }))}
          />
          <button
            type="button"
            onClick={() => setAttempt((value) => value + 1)}
            className="cursor-pointer rounded-lg bg-[#7659d9] px-4 py-2 text-sm font-medium text-white"
          >
            Try again
          </button>
          <Link to="/" className="ml-4 text-sm text-[#c5b8ff] hover:underline">Sign in</Link>
        </div>
      </main>
    );
  }
  if (check.status === 'unauthenticated') return <Navigate to="/" replace />;
  if (
    role === 'resident'
    && (!check.user.profileComplete || !check.user.profile)
  ) {
    return <Navigate to="/" replace />;
  }
  if (check.user.role !== role) {
    return <Navigate to={check.user.role === 'admin' ? '/dashboard' : '/resident'} replace />;
  }

  return <Outlet />;
};

export default RequireRole;
