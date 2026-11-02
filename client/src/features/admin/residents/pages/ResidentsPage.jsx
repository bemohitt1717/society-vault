import { Plus, Users, AlertCircle, DollarSign, Edit2, Trash2 } from 'lucide-react';
import useResidentsPage from '../hooks/useResidentsPage';
import ResidentForm from '../components/ResidentForm';
import { format } from 'date-fns';
import { adminPrimaryButtonClass } from '../../../../components/ui/actionButtonStyles';

const ResidentsPage = () => {
  const {
    activeTab, setActiveTab, residents, maintenanceDues, paymentHistory, duesSummary, tabs, showForm, editingResident,
    isLoading, error,
    addResident, editResident, deleteResident, closeForm, saveResident, getStatusColor,
  } = useResidentsPage();
  const renderContent = () => {
    switch (activeTab) {
      case 'residents':
        return (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button 
                onClick={addResident}
                className={adminPrimaryButtonClass}
              >
                <Plus className="w-4 h-4" />
                Add Resident
              </button>
            </div>

            <div className="bg-[#1a1a1e] border border-[#26262b] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#26262b]">
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Resident Name</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Flat</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Contact</th>
                      <th className="px-4 py-3.5 text-right text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Maintenance</th>
                      <th className="px-4 py-3.5 text-right text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Outstanding</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3.5 text-center text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#26262b]">
                    {residents.length === 0 ? (
                      <tr><td colSpan="8" className="px-4 py-12 text-center text-sm text-[#94a1b2]">No residents in the database yet.</td></tr>
                    ) : residents.map((resident) => (
                      <tr key={resident.id} className="hover:bg-[#1e1e22] transition-colors">
                        <td className="px-4 py-3.5 text-sm text-[#fffffe]">{resident.name}</td>
                        <td className="px-4 py-3.5 text-sm text-[#94a1b2] font-mono">{resident.flat}</td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-[#b8bec8]">
                            {resident.type}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-[#94a1b2]">{resident.contact}</td>
                        <td className="px-4 py-3.5 text-sm text-right text-[#fffffe]">₹{resident.maintenanceAmount.toLocaleString()}</td>
                        <td className="px-4 py-3.5 text-sm text-right">
                          <span className={resident.outstanding > 0 ? 'text-[#c99393] font-medium' : 'text-[#8db5a2] font-medium'}>
                            ₹{resident.outstanding.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`text-sm font-medium ${getStatusColor(resident.status)}`}>
                            {resident.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => editResident(resident)}
                              className="p-1.5 hover:bg-[#242629] rounded-lg transition-colors cursor-pointer text-[#94a1b2] hover:text-[#fffffe]"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteResident(resident.id)}
                              className="p-1.5 hover:bg-[#242629] rounded-lg transition-colors cursor-pointer text-[#94a1b2] hover:text-[#c99393]"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'dues':
        return (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-[#d2b88e]" />
                  <p className="text-xs text-[#aeb4bf]">Total Outstanding</p>
                </div>
                <h3 className="text-xl font-semibold text-[#e4d2b5]">₹{duesSummary.totalOutstanding.toLocaleString()}</h3>
              </div>

              <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-[#c99393]" />
                  <p className="text-xs text-[#aeb4bf]">Overdue Amount</p>
                </div>
                <h3 className="text-xl font-semibold text-[#e0b1b1]">₹{duesSummary.overdueAmount.toLocaleString()}</h3>
              </div>

              <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-[#b7acef]" />
                  <p className="text-xs text-[#aeb4bf]">Unpaid Bills</p>
                </div>
                <h3 className="text-xl font-semibold text-[#d0c8f4]">{duesSummary.unpaidBills}</h3>
              </div>
            </div>

            {/* Dues Table */}
            <div className="bg-[#1a1a1e] border border-[#26262b] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#26262b]">
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Period</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Flat</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Resident</th>
                      <th className="px-4 py-3.5 text-right text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Due</th>
                      <th className="px-4 py-3.5 text-right text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Paid</th>
                      <th className="px-4 py-3.5 text-right text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Outstanding</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Due Date</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#26262b]">
                    {maintenanceDues.length === 0 ? (
                      <tr><td colSpan="8" className="px-4 py-12 text-center text-sm text-[#94a1b2]">No maintenance dues in the database yet.</td></tr>
                    ) : maintenanceDues.map((due) => (
                      <tr key={due.id} className="hover:bg-[#1e1e22] transition-colors">
                        <td className="px-4 py-3.5 text-sm text-[#fffffe]">{due.period}</td>
                        <td className="px-4 py-3.5 text-sm text-[#94a1b2] font-mono">{due.flat}</td>
                        <td className="px-4 py-3.5 text-sm text-[#fffffe]">{due.resident}</td>
                        <td className="px-4 py-3.5 text-sm text-right text-[#fffffe]">₹{due.amountDue.toLocaleString()}</td>
                        <td className="px-4 py-3.5 text-sm text-right text-[#8db5a2]">₹{due.amountPaid.toLocaleString()}</td>
                        <td className="px-4 py-3.5 text-sm text-right">
                          <span className={due.outstanding > 0 ? 'text-[#c99393] font-medium' : 'text-[#8db5a2] font-medium'}>
                            ₹{due.outstanding.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-[#94a1b2]">{format(new Date(due.dueDate), 'MMM dd, yyyy')}</td>
                        <td className="px-4 py-3.5">
                          <span className={`text-sm font-medium ${getStatusColor(due.status)}`}>
                            {due.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="bg-[#1a1a1e] border border-[#26262b] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#26262b]">
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Payment Date</th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Resident</th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Flat</th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Period</th>
                    <th className="px-4 py-3.5 text-right text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Mode</th>
                    <th className="px-4 py-3.5 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#26262b]">
                  {paymentHistory.length === 0 ? (
                    <tr><td colSpan="7" className="px-4 py-12 text-center text-sm text-[#94a1b2]">No completed payments in the database yet.</td></tr>
                  ) : paymentHistory.map((payment) => (
                    <tr key={payment.id} className="hover:bg-[#1e1e22] transition-colors">
                      <td className="px-4 py-3.5 text-sm text-[#fffffe]">{format(new Date(payment.paymentDate), 'MMM dd, yyyy')}</td>
                      <td className="px-4 py-3.5 text-sm text-[#fffffe]">{payment.resident}</td>
                      <td className="px-4 py-3.5 text-sm text-[#94a1b2] font-mono">{payment.flat}</td>
                      <td className="px-4 py-3.5 text-sm text-[#94a1b2]">{payment.period}</td>
                      <td className="px-4 py-3.5 text-sm text-right text-[#8db5a2] font-medium">₹{payment.amount.toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-sm text-[#94a1b2]">{payment.mode}</td>
                      <td className="px-4 py-3.5 text-sm text-[#94a1b2] font-mono">{payment.reference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="bg-[#1a1a1e] border border-[#26262b] rounded-2xl p-1.5 flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#5c5197] text-white'
                : 'text-[#94a1b2] hover:text-[#fffffe] hover:bg-[#242629]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {error && <p role="alert" className="text-sm text-[#f0b2b4]">{error}</p>}
      {isLoading && <p className="text-sm text-[#94a1b2]">Loading {activeTab}...</p>}
      {renderContent()}

      {/* Form Modal */}
      {showForm && (
        <ResidentForm
          key={editingResident?.id || 'new'}
          resident={editingResident}
          onSave={saveResident}
          onClose={closeForm}
        />
      )}
    </div>
  );
};

export default ResidentsPage;
