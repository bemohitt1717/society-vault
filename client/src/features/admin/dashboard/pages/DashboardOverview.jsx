import { useEffect, useState } from 'react';
import { AlertCircle, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import RecentTransactionsTable from '../components/RecentTransactionsTable';
import { getAdminDashboard } from '../../../../services/api/adminApi';
import { getApiErrorMessage } from '../../../../services/api/http';

const DashboardOverview = () => {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getAdminDashboard()
      .then((data) => {
        if (active) setDashboard(data);
      })
      .catch((requestError) => {
        if (active) setError(getApiErrorMessage(requestError));
      });
    return () => { active = false; };
  }, []);

  if (error) return <p role="alert" className="text-sm text-[#f0b2b4]">{error}</p>;
  if (!dashboard) return <p className="text-sm text-[#94a1b2]">Loading dashboard...</p>;

  const { stats, monthlyData, recentTransactions } = dashboard;
  const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6">
      {/* Stats Cards Grid - 2 cols on mobile/tablet, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard
          title="Available Funds"
          value={formatCurrency(stats.availableFunds)}
          icon={Wallet}
          iconColor="#7f5af0"
        />
        <StatsCard
          title="Income This Month"
          value={formatCurrency(stats.totalIncome)}
          icon={TrendingUp}
          iconColor="#2cb67d"
        />
        <StatsCard
          title="Expenses This Month"
          value={formatCurrency(stats.totalExpenses)}
          icon={TrendingDown}
          iconColor="#ff6b6b"
        />
        <StatsCard
          title="Pending Dues"
          value={formatCurrency(stats.pendingDues)}
          icon={AlertCircle}
          iconColor="#ffa500"
        />
      </div>

      {/* Chart and Table in Same Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Chart - Takes more space (60%) */}
        <div className="xl:col-span-7">
          <IncomeExpenseChart data={monthlyData} />
        </div>
        
        {/* Recent Transactions - Takes less space (40%) */}
        <div className="xl:col-span-5">
          <RecentTransactionsTable transactions={recentTransactions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
