
import { Download, FileSpreadsheet, TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

import {
  exportActionButtonClass,
  exportActionIconClass,
} from '../../../../components/ui/actionButtonStyles';
import LoadingState from '../../../../components/ui/LoadingState';

import useReportsPage from '../hooks/useReportsPage';

const expenseChartColors = ['#ffc857', '#aa8cff', '#ff6482', '#42d4f4', '#38d9a9'];

const ReportsPage = () => {
  const {
    isExporting, isLoading, error, reportSummary, monthlyData, expenseBreakdown, detailedTransactions,
    handleExportPDF, handleExportExcel,
  } = useReportsPage();

  if (isLoading) return <LoadingState fullPage label="Loading financial report..." />;
  if (error) return <p role="alert" className="text-sm text-[#f0b2b4]">{error}</p>;

  return (
    <div className="space-y-4">
      {/* Main Layout: Report Content Left + Controls Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        
        {/* Report Content - Left Side */}
        <div className="xl:col-span-9 space-y-4">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-[#b8e8c6]" />
                <p className="text-xs text-[#8b8b90]">Total Income</p>
              </div>
              <h3 className="text-xl font-bold text-[#f4fcf9]">₹{reportSummary.totalIncome.toLocaleString()}</h3>
            </div>

            <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-[#f0b2b4]" />
                <p className="text-xs text-[#8b8b90]">Total Expenses</p>
              </div>
              <h3 className="text-xl font-bold text-[#fefcfc]">₹{reportSummary.totalExpenses.toLocaleString()}</h3>
            </div>

            <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-[#c9b9f2]" />
                <p className="text-xs text-[#8b8b90]">Surplus</p>
              </div>
              <h3 className="text-xl font-bold text-[#fcfcfd]">₹{reportSummary.surplus.toLocaleString()}</h3>
            </div>

            <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-[#ebcb8a]" />
                <p className="text-xs text-[#8b8b90]">Pending Dues</p>
              </div>
              <h3 className="text-xl font-bold text-[#fbfbfb]">₹{reportSummary.pendingDues.toLocaleString()}</h3>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Income vs Expenses Chart */}
            <div className="bg-[#1a1a1e] border border-[#26262b] rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-[#fffffe] mb-4">Income vs Expenses</h3>
              {monthlyData.length ? <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#303136" />
                  <XAxis dataKey="month" stroke="#94a1b2" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#94a1b2" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1e', border: '1px solid #26262b', borderRadius: '8px' }}
                    labelStyle={{ color: '#fffffe' }}
                  />
                  <Legend wrapperStyle={{ color: '#b8bec8', fontSize: '13px' }} />
                  <Bar dataKey="income" fill="#18c98b" radius={[5, 5, 0, 0]} />
                  <Bar dataKey="expenses" fill="#f65370" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer> : <p className="py-12 text-center text-sm text-[#94a1b2]">No financial records yet.</p>}
            </div>

            {/* Expense Breakdown */}
            <div className="bg-[#1a1a1e] border border-[#26262b] rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-[#fffffe] mb-4">Expense Breakdown</h3>
              {expenseBreakdown.length ? <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="amount"
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={expenseChartColors[index % expenseChartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1e', border: '1px solid #26262b', borderRadius: '8px' }}
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer> : <p className="py-12 text-center text-sm text-[#94a1b2]">No expense records yet.</p>}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {expenseBreakdown.map((item, index) => (
                  <div key={item.category} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: expenseChartColors[index % expenseChartColors.length] }}
                    />
                    <span className="text-xs text-[#94a1b2]">{item.category}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Transactions Table */}
          <div className="bg-[#1a1a1e] border border-[#26262b] rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#26262b]">
              <h3 className="text-sm font-semibold text-[#fffffe]">Detailed Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#26262b]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#94a1b2] uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#94a1b2] uppercase">Reference</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#94a1b2] uppercase">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#94a1b2] uppercase">Category</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-[#94a1b2] uppercase">Income</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-[#94a1b2] uppercase">Expense</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#26262b]">
                  {detailedTransactions.length === 0 ? (
                    <tr><td colSpan="6" className="px-4 py-10 text-center text-sm text-[#94a1b2]">No transactions yet.</td></tr>
                  ) : detailedTransactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-[#1e1e22] transition-colors">
                      <td className="px-4 py-3 text-sm text-[#fffffe]">{format(new Date(txn.date), 'MMM dd')}</td>
                      <td className="px-4 py-3 text-sm text-[#94a1b2] font-mono">{txn.reference}</td>
                      <td className="px-4 py-3 text-sm text-[#fffffe] max-w-xs truncate">{txn.description}</td>
                      <td className="px-4 py-3 text-sm text-[#94a1b2]">{txn.category}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        {txn.income > 0 && <span className="text-[#8db5a2] font-medium">₹{txn.income.toLocaleString()}</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        {txn.expense > 0 && <span className="text-[#c99393] font-medium">₹{txn.expense.toLocaleString()}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Controls Panel - Right Side */}
        <div className="xl:col-span-3">
          <div className="bg-[#1a1a1e] border border-[#26262b] rounded-2xl p-4 space-y-4 sticky top-4">
            <div>
              <label className="block text-xs font-semibold text-[#fffffe] uppercase tracking-wider mb-2">Report Options</label>
              
              <div className="space-y-3">
                <p className="text-sm text-[#94a1b2]">Financial data from all database records.</p>
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className={`${exportActionButtonClass} w-full`}
                >
                  <Download className={`w-4 h-4 ${exportActionIconClass}`} />
                  {isExporting ? 'Exporting...' : 'Export PDF'}
                </button>

                <button
                  onClick={handleExportExcel}
                  disabled={isExporting}
                  className={`${exportActionButtonClass} w-full`}
                >
                  <FileSpreadsheet className={`w-4 h-4 ${exportActionIconClass}`} />
                  Download Excel
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#2e2f33]">
              <p className="text-xs text-[#94a1b2]">
                Report Period: <span className="text-[#fffffe] font-medium">{reportSummary.period}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
