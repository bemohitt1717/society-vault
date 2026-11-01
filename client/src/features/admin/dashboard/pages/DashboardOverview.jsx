import { Wallet, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import RecentTransactionsTable from '../components/RecentTransactionsTable';
import { chartData, recentTransactions, statsData } from '../data/mockData';

const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards Grid - 2 cols on mobile/tablet, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard
          title="Available Funds"
          value={`₹${statsData.availableFunds.toLocaleString()}`}
          icon={Wallet}
          trend={statsData.trends.availableFunds.direction}
          trendValue={statsData.trends.availableFunds.value}
          iconColor="#7f5af0"
        />
        <StatsCard
          title="Total Income"
          value={`₹${statsData.totalIncome.toLocaleString()}`}
          icon={TrendingUp}
          trend={statsData.trends.totalIncome.direction}
          trendValue={statsData.trends.totalIncome.value}
          iconColor="#2cb67d"
        />
        <StatsCard
          title="Total Expenses"
          value={`₹${statsData.totalExpenses.toLocaleString()}`}
          icon={TrendingDown}
          trend={statsData.trends.totalExpenses.direction}
          trendValue={statsData.trends.totalExpenses.value}
          iconColor="#ff6b6b"
        />
        <StatsCard
          title="Pending Dues"
          value={`₹${statsData.pendingDues.toLocaleString()}`}
          icon={AlertCircle}
          trend={statsData.trends.pendingDues.direction}
          trendValue={statsData.trends.pendingDues.value}
          iconColor="#ffa500"
        />
      </div>

      {/* Chart and Table in Same Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Chart - Takes more space (60%) */}
        <div className="xl:col-span-7">
          <IncomeExpenseChart data={chartData} />
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
