import { Plus, Users, AlertCircle, DollarSign, Edit2, Trash2, Check, X } from 'lucide-react';
import useResidentsPage from '../hooks/useResidentsPage';
import ResidentForm from '../components/ResidentForm';
import MaintenanceDueForm from '../components/MaintenanceDueForm';
import RecordPaymentForm from '../components/RecordPaymentForm';
import { format } from 'date-fns';
import { adminPrimaryButtonClass, adminSecondaryButtonClass } from '../../../../components/ui/actionButtonStyles';
import LoadingState from '../../../../components/ui/LoadingState';
import ConfirmDialog from '../../../../components/ui/ConfirmDialog';

const formatCurrency = (amount) => {
  const value = Number(amount);
  return `₹${(Number.isFinite(value) ? value : 0).toLocaleString('en-IN')}`;
};

const ResidentsPage = () => {
  const {
    activeTab, setActiveTab, residents, maintenanceDues, paymentHistory, duesSummary, tabs, showForm, showDueForm,
    showPaymentForm, editingResident, paymentReview, paymentReviewError, isLoading, loadError, actionError, saveError, isSaving, isActionSaving,
    editResident, deleteResident, closeForm, saveResident, getStatusColor,
    retryLoad, openDueForm, openPaymentForm, closeDueForm, closePaymentForm, saveDue, savePayment,
    requestPaymentReview, confirmPaymentReview, cancelPaymentReview,
  } = useResidentsPage();

  if (isLoading) return <LoadingState fullPage label={`Loading ${activeTab}...`} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'residents':
        return (
          <div className="space-y-4">
            <p className="text-sm text-[#aeb4bf]">Residents create their accounts with their own details. Use Edit to update a resident’s information.</p>
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
                        <td className="px-4 py-3.5 text-sm text-right text-[#fffffe]">{formatCurrency(resident.maintenanceAmount)}</td>
                        <td className="px-4 py-3.5 text-sm text-right">
                          <span className={resident.outstanding > 0 ? 'text-[#c99393] font-medium' : 'text-[#8db5a2] font-medium'}>
                            {formatCurrency(resident.outstanding)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div>
                            <span className={`text-sm font-medium ${getStatusColor(resident.status)}`}>
                              {resident.status}
                            </span>
                            {resident.accountStatus === 'invited' && (
                              <span className="mt-1 block text-xs text-[#b8bac2]">Account not claimed</span>
                            )}
                          </div>
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
            <div className="flex justify-end">
              <button type="button" onClick={openDueForm} className={adminPrimaryButtonClass}>
                <Plus className="size-4" />
                Create due
              </button>
            </div>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-[#d2b88e]" />
                  <p className="text-xs text-[#aeb4bf]">Total Outstanding</p>
                </div>
                <h3 className="text-xl font-semibold text-[#e4d2b5]">{formatCurrency(duesSummary.totalOutstanding)}</h3>
              </div>

              <div className="bg-[#1a1a1e] border border-[#26262b] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-[#c99393]" />
                  <p className="text-xs text-[#aeb4bf]">Overdue Amount</p>
                </div>
                <h3 className="text-xl font-semibold text-[#e0b1b1]">{formatCurrency(duesSummary.overdueAmount)}</h3>
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
                        <td className="px-4 py-3.5 text-sm text-right text-[#fffffe]">{formatCurrency(due.amountDue)}</td>
                        <td className="px-4 py-3.5 text-sm text-right text-[#8db5a2]">{formatCurrency(due.amountPaid)}</td>
                        <td className="px-4 py-3.5 text-sm text-right">
                          <span className={due.outstanding > 0 ? 'text-[#c99393] font-medium' : 'text-[#8db5a2] font-medium'}>
                            {formatCurrency(due.outstanding)}
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
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-sm leading-6 text-[#c5cad3]">Accept a resident’s request after confirming receipt, or reject it to leave dues outstanding. Record offline payment is for money received outside a resident request.</p>
              <button type="button" onClick={openPaymentForm} className={`${adminSecondaryButtonClass} shrink-0`}>
                Record offline payment
              </button>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#26262b] bg-[#1a1a1e]">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#26262b]">
                      <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#94a1b2]">Payment Date</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#94a1b2]">Resident</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#94a1b2]">Flat</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#94a1b2]">Period</th>
                      <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-[#94a1b2]">Amount</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#94a1b2]">Mode</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#94a1b2]">Reference</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#94a1b2]">Status / Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#26262b]">
                    {paymentHistory.length === 0 ? (
                      <tr><td colSpan="8" className="px-4 py-12 text-center text-sm text-[#94a1b2]">No payment records yet.</td></tr>
                    ) : paymentHistory.map((payment) => (
                      <tr key={payment.id} className="hover:bg-[#1e1e22]">
                        <td className="px-4 py-3.5 text-sm text-[#fffffe]">{format(new Date(payment.paymentDate), 'MMM dd, yyyy')}</td>
                        <td className="px-4 py-3.5 text-sm text-[#fffffe]">{payment.resident}</td>
                        <td className="px-4 py-3.5 text-sm font-mono text-[#94a1b2]">{payment.flat}</td>
                        <td className="px-4 py-3.5 text-sm text-[#94a1b2]">{payment.period}</td>
                        <td className="px-4 py-3.5 text-right text-sm font-medium text-[#8db5a2]">{formatCurrency(payment.amount)}</td>
                        <td className="px-4 py-3.5 text-sm text-[#94a1b2]">{payment.mode}</td>
                        <td className="px-4 py-3.5 text-sm font-mono text-[#94a1b2]">{payment.reference}</td>
                        <td className="px-4 py-3.5 text-sm">
                          {payment.status === 'pending' ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                disabled={isActionSaving}
                                onClick={() => requestPaymentReview(payment, 'completed')}
                                className="inline-flex min-h-8 items-center gap-1.5 rounded-md border border-[#35664f] bg-[#1d3028] px-2.5 text-xs font-semibold text-[#a8d7bd] transition-colors hover:bg-[#243d31] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Check aria-hidden="true" className="size-3.5" />
                                Accept
                              </button>
                              <button
                                type="button"
                                disabled={isActionSaving}
                                onClick={() => requestPaymentReview(payment, 'failed')}
                                className="inline-flex min-h-8 items-center gap-1.5 rounded-md border border-[#704548] bg-[#352326] px-2.5 text-xs font-semibold text-[#e2a8ab] transition-colors hover:bg-[#432a2d] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <X aria-hidden="true" className="size-3.5" />
                                Reject
                              </button>
                            </div>
                          ) : <span className={payment.status === 'completed' ? 'text-[#8db5a2]' : 'text-[#aeb4bf]'}>{payment.statusLabel}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
      {actionError && <p role="alert" className="text-sm text-[#f0b2b4]">{actionError}</p>}
      {loadError ? (
        <div className="space-y-3">
          <p role="alert" className="text-sm text-[#f0b2b4]">{loadError}</p>
          <button type="button" onClick={retryLoad} className="text-sm font-medium text-[#c5b8ff] underline underline-offset-4">
            Try loading again
          </button>
        </div>
      ) : renderContent()}

      {/* Form Modal */}
      {showForm && editingResident && (
        <ResidentForm
          key={editingResident?.id || 'new'}
          resident={editingResident}
          onSave={saveResident}
          onClose={closeForm}
          error={saveError}
          isSaving={isSaving}
        />
      )}
      {showDueForm && (
        <MaintenanceDueForm
          residents={residents}
          error={actionError}
          isSaving={isActionSaving}
          onSave={saveDue}
          onClose={closeDueForm}
        />
      )}
      {showPaymentForm && (
        <RecordPaymentForm
          residents={residents}
          error={actionError}
          isSaving={isActionSaving}
          onSave={savePayment}
          onClose={closePaymentForm}
        />
      )}
      {paymentReview && (
        <ConfirmDialog
          isOpen
          title={paymentReview.status === 'completed' ? 'Accept payment request?' : 'Reject payment request?'}
          description={paymentReview.status === 'completed'
            ? `Confirm that ${formatCurrency(paymentReview.payment.amount)} was received from ${paymentReview.payment.resident}. Accepting settles the associated dues and records the payment as society income.`
            : `Reject the ${formatCurrency(paymentReview.payment.amount)} request from ${paymentReview.payment.resident}? Their dues will remain outstanding.`}
          confirmLabel={paymentReview.status === 'completed' ? 'Accept payment' : 'Reject request'}
          confirmVariant={paymentReview.status === 'completed' ? 'success' : 'danger'}
          error={paymentReviewError}
          isLoading={isActionSaving}
          onConfirm={confirmPaymentReview}
          onCancel={cancelPaymentReview}
        />
      )}
    </div>
  );
};

export default ResidentsPage;
