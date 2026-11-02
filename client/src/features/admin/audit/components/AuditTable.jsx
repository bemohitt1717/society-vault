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
            </tr>
          </thead>
          <tbody className="divide-y divide-[#26262b]">
            {logs.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-[#94a1b2]">No audit logs match the current filters.</p>
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
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-[#26262b] px-4 py-3.5 text-sm text-[#94a1b2]">
        {logs.length} {logs.length === 1 ? 'log' : 'logs'}
      </div>
    </div>
  );
};

export default AuditTable;
