import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../../../../components/ui/Card';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[#242629] border border-[#2e2f33] rounded-lg p-3 shadow-lg">
      <p className="text-sm text-[#94a1b2] mb-2">{payload[0].payload.month}</p>
      <div className="space-y-1">
        <p className="text-sm text-[#91c7a9] font-medium">
          Income: ₹{Number(payload.find((item) => item.dataKey === 'income')?.value || 0).toLocaleString('en-IN')}
        </p>
        <p className="text-sm text-[#d89295] font-medium">
          Expenses: ₹{Number(payload.find((item) => item.dataKey === 'expenses')?.value || 0).toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
};

const IncomeExpenseChart = ({ data }) => {
  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#fffffe]">Income vs Expenses</h3>
        <p className="text-sm text-[#94a1b2] mt-1">Monthly comparison for last 6 months</p>
      </div>

      {data.length ? <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} barCategoryGap="20%" barGap={6}>
          <CartesianGrid strokeDasharray="3 3" stroke="#303136" />
          <XAxis 
            dataKey="month" 
            stroke="#94a1b2"
            axisLine={{ stroke: '#3b3d42', strokeWidth: 1 }}
            tickLine={false}
            tick={{ fill: '#94a1b2', fontSize: 12 }}
          />
          <YAxis 
            stroke="#94a1b2"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a1b2', fontSize: 12 }}
            tickFormatter={(value) => `₹${value/1000}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#2e2f33', opacity: 0.4 }} />
          <Legend 
            wrapperStyle={{ color: '#b8bec8', fontSize: '13px' }}
            iconType="circle"
          />
          <Bar dataKey="income" fill="#91c7a9" radius={[5, 5, 0, 0]} name="Income" maxBarSize={40} />
          <Bar dataKey="expenses" fill="#d89295" radius={[5, 5, 0, 0]} name="Expenses" maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer> : (
        <p className="py-12 text-center text-sm text-[#94a1b2]">No income or expense records yet.</p>
      )}
    </Card>
  );
};

export default IncomeExpenseChart;
