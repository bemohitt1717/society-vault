import { useState } from 'react';
import { X } from 'lucide-react';
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

const localMonthValue = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
const monthLabel = (value) => (/^\d{4}-(0[1-9]|1[0-2])$/.test(value)
  ? new Date(`${value}-01T00:00:00Z`).toLocaleString('en-IN', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
  : '');

const MaintenanceDueForm = ({ residents, error, isSaving, onSave, onClose }) => {
  const today = new Date();
  const [billingMonth, setBillingMonth] = useState(localMonthValue(today));
  const [formData, setFormData] = useState({
    resident: '',
    month: monthLabel(localMonthValue(today)),
    category: 'Maintenance Charges',
    amount: '',
    penalty: '0',
    dueDate: localDateValue(today),
  });

  const handleResidentChange = (residentId) => {
    const resident = residents.find((item) => item.id === residentId);
    setFormData((current) => ({
      ...current,
      resident: residentId,
      amount: resident?.maintenanceAmount ? String(resident.maintenanceAmount) : '',
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      ...formData,
      amount: Number(formData.amount),
      penalty: Number(formData.penalty || 0),
    });
  };

  return (
    <div className={adminDialogBackdropClass}>
      <div role="dialog" aria-modal="true" aria-labelledby="due-form-title" className={adminDialogPanelClass}>
        <div className="flex items-center justify-between border-b border-[#303136] px-5 py-4 sm:px-6">
          <h2 id="due-form-title" className="text-lg font-semibold text-[#f4f4f5]">Create maintenance due</h2>
          <button type="button" onClick={onClose} aria-label="Close due form" className="rounded-lg p-1.5 text-[#aeb4bf] hover:bg-[#242629] hover:text-[#f4f4f5]">
            <X className="size-5" />
          </button>
        </div>
        <form id="due-form" onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-5 py-4 sm:px-6">
          {error && <p role="alert" className="rounded-lg border border-[#8d4b4d] bg-[#2c1d20] px-3 py-2 text-sm text-[#f0b2b4]">{error}</p>}
          {residents.length === 0 ? (
            <p className="text-sm text-[#c5cad3]">Add a resident first. Only residents with active membership can be billed.</p>
          ) : (
            <>
              <div>
                <label htmlFor="due-resident" className="mb-1.5 block text-sm font-medium text-[#d8d9de]">Resident</label>
                <select id="due-resident" required value={formData.resident} onChange={(event) => handleResidentChange(event.target.value)} className={`${adminFormFieldClass} cursor-pointer`}>
                  <option value="">Select resident</option>
                  {residents.filter((resident) => resident.status === 'Active').map((resident) => (
                    <option key={resident.id} value={resident.id}>{resident.name} · {resident.flat}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="due-month" className="mb-1.5 block text-sm font-medium text-[#d8d9de]">Billing period</label>
                  <input id="due-month" required type="month" value={billingMonth} onChange={(event) => {
                    setBillingMonth(event.target.value);
                    setFormData((current) => ({ ...current, month: monthLabel(event.target.value) }));
                  }} className={adminFormFieldClass} />
                </div>
                <div>
                  <label htmlFor="due-category" className="mb-1.5 block text-sm font-medium text-[#d8d9de]">Category</label>
                  <input id="due-category" required maxLength={80} value={formData.category} onChange={(event) => setFormData((current) => ({ ...current, category: event.target.value }))} className={adminFormFieldClass} />
                </div>
                <div>
                  <label htmlFor="due-amount" className="mb-1.5 block text-sm font-medium text-[#d8d9de]">Amount (₹)</label>
                  <input id="due-amount" required type="number" min="0.01" step="0.01" value={formData.amount} onChange={(event) => setFormData((current) => ({ ...current, amount: event.target.value }))} className={adminFormFieldClass} />
                </div>
                <div>
                  <label htmlFor="due-penalty" className="mb-1.5 block text-sm font-medium text-[#d8d9de]">Penalty (₹, optional)</label>
                  <input id="due-penalty" type="number" min="0" step="0.01" value={formData.penalty} onChange={(event) => setFormData((current) => ({ ...current, penalty: event.target.value }))} className={adminFormFieldClass} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="due-date" className="mb-1.5 block text-sm font-medium text-[#d8d9de]">Due date</label>
                  <input id="due-date" required type="date" value={formData.dueDate} onChange={(event) => setFormData((current) => ({ ...current, dueDate: event.target.value }))} className={adminFormFieldClass} />
                </div>
              </div>
            </>
          )}
        </form>
        <div className="flex justify-end gap-3 border-t border-[#303136] px-5 py-4 sm:px-6">
          <button type="button" onClick={onClose} className={adminSecondaryButtonClass}>Cancel</button>
          <button type="submit" form="due-form" disabled={isSaving || residents.length === 0} className={adminPrimaryButtonClass}>
            {isSaving ? 'Creating…' : 'Create due'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDueForm;
