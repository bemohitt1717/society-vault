import { X } from 'lucide-react';
import { incomeCategories, paymentModes } from '../data/mockIncomeData';
import useIncomeForm from '../hooks/useIncomeForm';
import {
  adminDialogBackdropClass,
  adminDialogPanelClass,
  adminFormFieldClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from '../../../../components/ui/actionButtonStyles';

const IncomeForm = ({ income, onSave, onClose }) => {
  const { formData, errors, handleChange, handleSubmit } = useIncomeForm(income, onSave);
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
                  {incomeCategories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
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
                  Resident Name
                </label>
                <input
                  type="text"
                  value={formData.resident}
                  onChange={(e) => handleChange('resident', e.target.value)}
                  className={adminFormFieldClass}
                  placeholder="Raj Kumar"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#fffffe] mb-1.5">
                  Flat / Unit Number
                </label>
                <input
                  type="text"
                  value={formData.flat}
                  onChange={(e) => handleChange('flat', e.target.value)}
                  className={adminFormFieldClass}
                  placeholder="A-101"
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
            className={adminPrimaryButtonClass}
          >
            {income ? 'Update Income' : 'Save Income'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomeForm;
