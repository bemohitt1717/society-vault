import { useNavigate } from 'react-router-dom';
import { paymentHistory, residentStats, upcomingMaintenance } from '../data/mockResidentData';

const useResidentDashboard = () => {
  const navigate = useNavigate();

  return {
    stats: residentStats,
    recentPayments: paymentHistory.slice(0, 5),
    maintenance: upcomingMaintenance.slice(0, 3),
    viewAllPayments: () => navigate('/resident/payments'),
  };
};

export default useResidentDashboard;
