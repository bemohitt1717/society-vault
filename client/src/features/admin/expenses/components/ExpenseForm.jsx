import { X, Upload } from 'lucide-react';
import { paymentModes, paymentStatuses } from '../data/expenseOptions';
import useExpenseForm from '../hooks/useExpenseForm';
import {
  adminDialogBackdropClass,
  adminDialogPanelClass,
  adminFormFieldClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from '../../../../components/ui/actionButtonStyles';

const ExpenseForm = ({ expense, categories, actionError, isSaving, onSave, onClose }) => {
  const { formData, errors, handleChange, handleSubmit } = useExpenseForm(expense, onSave);
  return (
    <div className={adminDialogBackdropClass}>
      <div role="dialog" aria-modal="true" aria-labelledby="expense-form-title" className={adminDialogPanelClass}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#303136] px-5 py-4 sm:px-6">
          <h2 id="expense-form-title" className="text-lg font-semibold text-[#f4f4f5]">
            {expense ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close expense form"
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
                  Expense Title / Description <span className="text-[#c99393]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className={`${adminFormFieldClass} ${errors.description ? 'border-[#c99393]' : ''}`}
                  placeholder="e.g., Elevator Maintenance"
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
                  placeholder="45000"
                />
                {errors.amount && (
                  <p className="text-xs text-[#d59696] mt-1">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#d8d9de] mb-1.5">
                  Expense Date <span className="text-[#c99393]">*</span>
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
                  Vendor / Payee <span className="text-[#c99393]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.vendor}
                  onChange={(e) => handleChange('vendor', e.target.value)}
                  className={`${adminFormFieldClass} ${errors.vendor ? 'border-[#c99393]' : ''}`}
                  placeholder="Kumar Plumbing Works"
                />
                {errors.vendor && (
                  <p className="text-xs text-[#d59696] mt-1">{errors.vendor}</p>
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
                  Payment Status
                </label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => handleChange('paymentStatus', e.target.value)}
                  className={`${adminFormFieldClass} cursor-pointer`}
                >
                  {paymentStatuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#fffffe] mb-1.5">
                  Transaction / Reference Number
                </label>
                <input
                  type="text"
                  value={formData.transactionRef}
                  onChange={(e) => handleChange('transactionRef', e.target.value)}
                  className={adminFormFieldClass}
                  placeholder="TXN123456789"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#fffffe] mb-1.5">
                  Invoice / Receipt Upload
                </label>
                <div className="rounded-lg border border-dashed border-[#3b3d42] p-6 text-center transition-colors hover:border-[#766bb2] cursor-pointer">
                  <Upload className="w-8 h-8 text-[#94a1b2] mx-auto mb-2" />
                  <p className="text-sm text-[#94a1b2]">Click to upload or drag and drop</p>
                  <p className="text-xs text-[#969ba5] mt-1">PDF, JPG, PNG up to 10MB</p>
                </div>
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
            {isSaving ? 'Saving...' : expense ? 'Update Expense' : 'Save Expense'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;
