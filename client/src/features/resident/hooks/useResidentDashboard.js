import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getResidentDashboard } from '../../../services/api/residentApi';
import { getApiErrorMessage } from '../../../services/api/http';

const emptyStats = {
  myDueAmount: 0,
  paidThisMonth: 0,
  totalPaidYear: 0,
  pendingReceipts: 0,
};

const useResidentDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(emptyStats);
  const [recentPayments, setRecentPayments] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    getResidentDashboard()
      .then((dashboard) => {
        if (!active) return;
        setStats({ ...emptyStats, ...(dashboard.stats || {}) });
        setRecentPayments(dashboard.recentPayments || []);
        setMaintenance(dashboard.maintenance || []);
      })
      .catch((requestError) => {
        if (active) {
          setError(getApiErrorMessage(requestError));
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  return {
    stats,
    recentPayments,
    maintenance,
    isLoading,
    error,
    reload: () => {
      setIsLoading(true);
      setError('');
      setReloadKey((key) => key + 1);
    },
    viewAllPayments: () => navigate('/resident/payments'),
  };
};

export default useResidentDashboard;
