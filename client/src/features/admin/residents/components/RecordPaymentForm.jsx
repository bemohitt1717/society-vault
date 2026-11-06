import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { listResidentDues } from '../../../../services/api/adminApi';
import { getApiErrorMessage } from '../../../../services/api/http';
import { paymentModes } from '../../income/data/incomeOptions';
import {
  adminDialogBackdropClass,
  adminDialogPanelClass,
  adminFormFieldClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from '../../../../components/ui/actionButtonStyles';

const localDateValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

const RecordPaymentForm = ({ residents, error, isSaving, onSave, onClose }) => {
  const [residentId, setResidentId] = useState('');
  const [dues, setDues] = useState([]);
  const [selectedDueIds, setSelectedDueIds] = useState([]);
  const [paymentMode, setPaymentMode] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [date, setDate] = useState(() => localDateValue(new Date()));
  const [isLoadingDues, setIsLoadingDues] = useState(false);
  const [duesError, setDuesError] = useState('');

  useEffect(() => {
    if (!residentId) return undefined;
    let active = true;
    listResidentDues(residentId, { page: 1, limit: 100 })
      .then((result) => {
        if (active) {
          setDues((result.data?.items || []).filter((due) => ['pending', 'partially_paid'].includes(due.status)));
          setSelectedDueIds([]);
        }
      })
      .catch((requestError) => {
        if (active) setDuesError(getApiErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setIsLoadingDues(false);
      });
    return () => { active = false; };
  }, [residentId]);

  const selectedDues = useMemo(
    () => dues.filter((due) => selectedDueIds.includes(due.id || due._id)),
    [dues, selectedDueIds],
  );
  const amount = selectedDues.reduce(
    (total, due) => total + Math.max((due.amount || 0) + (due.penalty || 0) - (due.paidAmount || 0), 0),
    0,
  );

  const toggleDue = (id) => {
    setSelectedDueIds((current) => current.includes(id)
      ? current.filter((selectedId) => selectedId !== id)
      : [...current, id]);
  };

  const handleResidentChange = (nextResidentId) => {
    setDues([]);
    setSelectedDueIds([]);
    setDuesError('');
    setIsLoadingDues(Boolean(nextResidentId));
    setResidentId(nextResidentId);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      resident: residentId,
      dueIds: selectedDueIds,
      amount,
      paymentMode,
      transactionId: transactionId.trim(),
      date,
      status: 'completed',
    });
  };

  const activeResidents = residents.filter((resident) => resident.status === 'Active');

  return (
    <div className={adminDialogBackdropClass}>
      <div role="dialog" aria-modal="true" aria-labelledby="record-payment-title" className={adminDialogPanelClass}>
        <div className="flex items-center justify-between border-b border-[#303136] px-5 py-4 sm:px-6">
          <h2 id="record-payment-title" className="text-lg font-semibold text-[#f4f4f5]">Record offline payment</h2>
          <button type="button" onClick={onClose} aria-label="Close payment form" className="rounded-lg p-1.5 text-[#aeb4bf] hover:bg-[#242629] hover:text-[#f4f4f5]">
            <X className="size-5" />
          </button>
        </div>
        <form id="record-payment-form" onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-5 py-4 sm:px-6">
          <p className="text-sm leading-6 text-[#c5cad3]">Use this for money received outside a resident-submitted request, such as cash or a direct transfer. Recording it settles the selected dues and adds the income automatically; do not enter it again under Income.</p>
          {error && <p role="alert" className="rounded-lg border border-[#8d4b4d] bg-[#2c1d20] px-3 py-2 text-sm text-[#f0b2b4]">{error}</p>}
          <div>
            <label htmlFor="payment-resident" className="mb-1.5 block text-sm font-medium text-[#d8d9de]">Resident</label>
            <select id="payment-resident" required value={residentId} onChange={(event) => handleResidentChange(event.target.value)} className={`${adminFormFieldClass} cursor-pointer`}>
              <option value="">Select resident</option>
              {activeResidents.map((resident) => <option key={resident.id} value={resident.id}>{resident.name} · {resident.flat}</option>)}
            </select>
          </div>

          {residentId && (
            <fieldset className="space-y-2">
              <legend className="mb-2 text-sm font-medium text-[#d8d9de]">Outstanding dues to settle</legend>
              {isLoadingDues ? <p className="text-sm text-[#aeb4bf]">Loading outstanding dues…</p> : null}
              {duesError && <p role="alert" className="text-sm text-[#f0b2b4]">{duesError}</p>}
              {!isLoadingDues && !duesError && dues.length === 0 && <p className="text-sm text-[#aeb4bf]">This resident has no outstanding dues.</p>}
              {selectedDueIds.length >= 20 && <p className="text-xs text-[#b8bac2]">A payment can settle up to 20 due items at once.</p>}
              {dues.map((due) => {
                const id = due.id || due._id;
                const outstanding = Math.max((due.amount || 0) + (due.penalty || 0) - (due.paidAmount || 0), 0);
                return (
                  <label key={id} className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#35363b] px-3 py-3">
                    <input type="checkbox" checked={selectedDueIds.includes(id)} disabled={!selectedDueIds.includes(id) && selectedDueIds.length >= 20} onChange={() => toggleDue(id)} className="mt-1 accent-[#8875d1]" />
                    <span className="flex-1 text-sm text-[#d8d9de]">{due.month} · {due.category}<span className="mt-1 block text-xs text-[#aeb4bf]">{formatCurrency(outstanding)} outstanding</span></span>
                  </label>
                );
              })}
            </fieldset>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="payment-amount" className="mb-1.5 block text-sm font-medium text-[#d8d9de]">Amount received</label>
              <input id="payment-amount" readOnly value={amount ? amount.toFixed(2) : ''} placeholder="Select dues above" className={`${adminFormFieldClass} opacity-75`} />
            </div>
            <div>
              <label htmlFor="payment-mode" className="mb-1.5 block text-sm font-medium text-[#d8d9de]">Payment mode</label>
              <select id="payment-mode" required value={paymentMode} onChange={(event) => setPaymentMode(event.target.value)} className={`${adminFormFieldClass} cursor-pointer`}>
                <option value="">Select mode</option>
                {paymentModes.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="payment-date" className="mb-1.5 block text-sm font-medium text-[#d8d9de]">Date received</label>
              <input id="payment-date" required type="date" value={date} onChange={(event) => setDate(event.target.value)} className={adminFormFieldClass} />
            </div>
            <div>
              <label htmlFor="payment-reference" className="mb-1.5 block text-sm font-medium text-[#d8d9de]">Reference (optional)</label>
              <input id="payment-reference" maxLength={120} value={transactionId} onChange={(event) => setTransactionId(event.target.value)} className={adminFormFieldClass} />
            </div>
          </div>
        </form>
        <div className="flex justify-end gap-3 border-t border-[#303136] px-5 py-4 sm:px-6">
          <button type="button" onClick={onClose} className={adminSecondaryButtonClass}>Cancel</button>
          <button type="submit" form="record-payment-form" disabled={isSaving || isLoadingDues || !selectedDueIds.length || !paymentMode || amount <= 0} className={adminPrimaryButtonClass}>
            {isSaving ? 'Recording…' : `Record ${amount ? formatCurrency(amount) : 'payment'}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordPaymentForm;
