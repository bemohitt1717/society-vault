import { Eye } from 'lucide-react';
import { format } from 'date-fns';

const AuditTable = ({ logs }) => {
  const getActionColor = (action) => {
    switch (action) {
      case 'Created':
        return 'text-[#8db5a2]';
      case 'Updated':
        return 'text-[#b7acef]';
      case 'Deleted':
        return 'text-[#c99393]';
      case 'Exported':
        return 'text-[#8ba9bb]';
      case 'Login':
      case 'Logout':
        return 'text-[#d2b88e]';
      default:
        return 'text-[#aeb4bf]';
    }
  };

  return (
    <div className="bg-[#1a1a1e] border border-[#26262b] rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#26262b]">
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Timestamp</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">User</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Action</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Module</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Record</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Description</th>
              <th className="px-4 py-3.5 text-center text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#26262b]">
            {logs.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-[#94a1b2]">No audit logs found</p>
                    <p className="text-xs text-[#6b6b70]">Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((log) => (
              <tr key={log.id} className="hover:bg-[#1e1e22] transition-colors">
                <td className="px-4 py-3.5 text-sm text-[#fffffe]">
                  {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm')}
                </td>
                <td className="px-4 py-3.5 text-sm text-[#fffffe]">{log.user}</td>
                <td className="px-4 py-3.5">
                  <span className={`text-sm font-medium ${getActionColor(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-sm text-[#94a1b2]">{log.module}</td>
                <td className="px-4 py-3.5 text-sm text-[#94a1b2] font-mono">{log.record}</td>
                <td className="px-4 py-3.5 text-sm text-[#fffffe] max-w-xs truncate">
                  {log.description}
                </td>
                <td className="px-4 py-3.5 text-center">
                  <button
                    className="p-1.5 hover:bg-[#242629] rounded-lg transition-colors cursor-pointer text-[#94a1b2] hover:text-[#fffffe]"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3.5 border-t border-[#26262b]">
        <p className="text-sm text-[#94a1b2]">
          Showing <span className="font-medium text-[#fffffe]">1-{Math.min(logs.length, 8)}</span> of{' '}
          <span className="font-medium text-[#fffffe]">{logs.length}</span> {logs.length === 1 ? 'log' : 'logs'}
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm border border-[#3b3d42] hover:border-[#55575e] rounded-lg text-[#b8bec8] hover:text-[#f4f4f5] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a5a7ad]">
            Previous
          </button>
          <button className="px-3 py-1.5 text-sm bg-[#5c5197] text-white rounded-lg cursor-pointer">
            1
          </button>
          <button className="px-3 py-1.5 text-sm border border-[#3b3d42] hover:border-[#55575e] rounded-lg text-[#b8bec8] hover:text-[#f4f4f5] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a5a7ad]">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditTable;
