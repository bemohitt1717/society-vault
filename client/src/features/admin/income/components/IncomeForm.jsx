import { X } from 'lucide-react';
import { paymentModes } from '../data/incomeOptions';
import useIncomeForm from '../hooks/useIncomeForm';
import {
  adminDialogBackdropClass,
  adminDialogPanelClass,
  adminFormFieldClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from '../../../../components/ui/actionButtonStyles';

const IncomeForm = ({ income, categories, residents, residentsLoading, residentsError, actionError, isSaving, onSave, onClose }) => {
  const { formData, errors, handleChange, handleResidentChange, handleSubmit } = useIncomeForm(income, residents, onSave);
  return (
    <div className={adminDialogBackdropClass}>
      <div role="dialog" aria-modal="true" aria-labelledby="income-form-title" className={adminDialogPanelClass}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#303136] px-5 py-4 sm:px-6">
          <h2 id="income-form-title" className="text-lg font-semibold text-[#f4f4f5]">
            {income ? 'Edit Income' : 'Add New Income'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close income form"
            className="rounded-lg p-1.5 text-[#aeb4bf] transition-colors hover:bg-[#242629] hover:text-[#f4f4f5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a5a7ad] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          {actionError && <p role="alert" className="mb-4 rounded-lg border border-[#8d4b4d] bg-[#2c1d20] px-3 py-2 text-sm text-[#f0b2b4]">{actionError}</p>}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#d8d9de] mb-1.5">
                  Income Source / Description <span className="text-[#c99393]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className={`${adminFormFieldClass} ${errors.description ? 'border-[#c99393]' : ''}`}
                  placeholder="e.g., Monthly Maintenance - Oct 2026"
                />
                {errors.description && (
                  <p className="text-xs text-[#d59696] mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#d8d9de] mb-1.5">
                  Category <span className="text-[#c99393]">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className={`${adminFormFieldClass} cursor-pointer ${errors.category ? 'border-[#c99393]' : ''}`}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id || cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-xs text-[#d59696] mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#d8d9de] mb-1.5">
                  Amount (₹) <span className="text-[#c99393]">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  className={`${adminFormFieldClass} ${errors.amount ? 'border-[#c99393]' : ''}`}
                  placeholder="35000"
                />
                {errors.amount && (
                  <p className="text-xs text-[#d59696] mt-1">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#d8d9de] mb-1.5">
                  Date Received <span className="text-[#c99393]">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className={`${adminFormFieldClass} ${errors.date ? 'border-[#c99393]' : ''}`}
                />
                {errors.date && (
                  <p className="text-xs text-[#d59696] mt-1">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#d8d9de] mb-1.5">
                  Payment Mode <span className="text-[#c99393]">*</span>
                </label>
                <select
                  value={formData.paymentMode}
                  onChange={(e) => handleChange('paymentMode', e.target.value)}
                  className={`${adminFormFieldClass} cursor-pointer ${errors.paymentMode ? 'border-[#c99393]' : ''}`}
                >
                  <option value="">Select Mode</option>
                  {paymentModes.map((mode) => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
                {errors.paymentMode && (
                  <p className="text-xs text-[#d59696] mt-1">{errors.paymentMode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#fffffe] mb-1.5">
                  Transaction / Reference ID
                </label>
                <input
                  type="text"
                  value={formData.transactionRef}
                  onChange={(e) => handleChange('transactionRef', e.target.value)}
                  className={adminFormFieldClass}
                  placeholder="TXN789456123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#fffffe] mb-1.5">
                  Resident (optional)
                </label>
                <select
                  value={formData.residentId}
                  onChange={(e) => handleResidentChange(e.target.value)}
                  className={`${adminFormFieldClass} cursor-pointer`}
                  disabled={residentsLoading}
                >
                  <option value="">{residentsLoading ? 'Loading residents…' : 'Not linked to a resident'}</option>
                  {residents.map((resident) => (
                    <option key={resident.id} value={resident.id}>
                      {resident.name} · {resident.flat}
                    </option>
                  ))}
                </select>
                {residentsError && <p role="alert" className="mt-1 text-xs text-[#d59696]">{residentsError}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#fffffe] mb-1.5">
                  Flat / Unit Number
                </label>
                <input
                  type="text"
                  value={formData.flat}
                  readOnly
                  className={`${adminFormFieldClass} opacity-75`}
                  placeholder="Auto-filled when a resident is selected"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#fffffe] mb-1.5">
                  Remarks
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => handleChange('remarks', e.target.value)}
                  rows="3"
                  className={`${adminFormFieldClass} resize-none`}
                  placeholder="Additional notes or remarks..."
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#303136] px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className={adminSecondaryButtonClass}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className={adminPrimaryButtonClass}
          >
            {isSaving ? 'Saving...' : income ? 'Update Income' : 'Save Income'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomeForm;
