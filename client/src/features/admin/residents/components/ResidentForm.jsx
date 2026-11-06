import { X } from 'lucide-react';
import useResidentForm from '../hooks/useResidentForm';
import {
  adminDialogBackdropClass,
  adminDialogPanelClass,
  adminFormFieldClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from '../../../../components/ui/actionButtonStyles';

const ResidentForm = ({ resident, onSave, onClose, error, isSaving }) => {
  const { formData, updateField, handleSubmit } = useResidentForm(resident, onSave);
  return (
    <div
      className={`${adminDialogBackdropClass} cursor-pointer`}
      onClick={(event) => {
        if (!isSaving && event.target === event.currentTarget) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="resident-form-title" className={`${adminDialogPanelClass} cursor-auto`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#303136] px-5 py-4 sm:px-6">
          <div>
            <h2 id="resident-form-title" className="text-lg font-semibold text-[#f4f4f5]">
              Edit Resident
            </h2>
            <p className="mt-1 text-sm text-[#aeb4bf]">
              Update details for {resident.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close resident form"
            className="rounded-lg p-2 text-[#aeb4bf] transition-colors hover:bg-[#242629] hover:text-[#f4f4f5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a5a7ad] cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form id="resident-form" onSubmit={handleSubmit} className="max-h-[calc(92vh-150px)] overflow-y-auto px-5 py-4 sm:px-6">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="resident-name" className="mb-1.5 block text-sm font-medium text-[#d8d9de]">
                Resident Name <span className="text-[#c99393]">*</span>
              </label>
              <input
                id="resident-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className={adminFormFieldClass}
                placeholder="Enter full name"
              />
            </div>

            {/* Flat & Type Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="resident-flat" className="mb-1.5 block text-sm font-medium text-[#d8d9de]">
                  Flat Number <span className="text-[#c99393]">*</span>
                </label>
                <input
                  id="resident-flat"
                  type="text"
                  required
                  value={formData.flat}
                  onChange={(e) => updateField('flat', e.target.value)}
                  className={adminFormFieldClass}
                  placeholder="e.g., A-101"
                />
              </div>

              <div>
                <label htmlFor="resident-type" className="mb-1.5 block text-sm font-medium text-[#d8d9de]">
                  Type <span className="text-[#c99393]">*</span>
                </label>
                <select
                  id="resident-type"
                  required
                  value={formData.type}
                  onChange={(e) => updateField('type', e.target.value)}
                  className={`${adminFormFieldClass} cursor-pointer`}
                >
                  <option value="Owner">Owner</option>
                  <option value="Tenant">Tenant</option>
                </select>
              </div>
            </div>

            {/* Contact & Email Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="resident-contact" className="mb-1.5 block text-sm font-medium text-[#d8d9de]">
                  Contact Number <span className="text-[#c99393]">*</span>
                </label>
                <input
                  id="resident-contact"
                  type="tel"
                  required
                  value={formData.contact}
                  onChange={(e) => updateField('contact', e.target.value)}
                  className={adminFormFieldClass}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label htmlFor="resident-email" className="mb-1.5 block text-sm font-medium text-[#d8d9de]">
                  Email Address <span className="text-[#c99393]">*</span>
                </label>
                <input
                  id="resident-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className={adminFormFieldClass}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* Maintenance Amount & Status Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="resident-maintenance" className="mb-1.5 block text-sm font-medium text-[#d8d9de]">
                  Maintenance Amount <span className="text-[#c99393]">*</span>
                </label>
                <input
                  id="resident-maintenance"
                  type="number"
                  required
                  min="0"
                  value={formData.maintenanceAmount ?? ''}
                  onChange={(e) => updateField('maintenanceAmount', e.target.value === '' ? '' : Number(e.target.value))}
                  className={adminFormFieldClass}
                  placeholder="3500"
                />
              </div>

              <div>
                <label htmlFor="resident-status" className="mb-1.5 block text-sm font-medium text-[#d8d9de]">
                  Status <span className="text-[#c99393]">*</span>
                </label>
                <select
                  id="resident-status"
                  required
                  value={formData.status}
                  onChange={(e) => updateField('status', e.target.value)}
                  className={`${adminFormFieldClass} cursor-pointer`}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
          {error && (
            <p role="alert" className="mt-4 rounded-lg border border-[#75464a] bg-[#392629] px-3 py-2.5 text-sm text-[#f0b2b4]">
              {error}
            </p>
          )}
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-[#303136] px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className={adminSecondaryButtonClass}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="resident-form"
            disabled={isSaving}
            className={adminPrimaryButtonClass}
          >
            {isSaving ? 'Saving...' : 'Update Resident'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResidentForm;
