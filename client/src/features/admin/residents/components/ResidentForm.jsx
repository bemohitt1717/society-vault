import { X } from 'lucide-react';
import useResidentForm from '../hooks/useResidentForm';
import {
  adminDialogBackdropClass,
  adminDialogPanelClass,
  adminFormFieldClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from '../../../../components/ui/actionButtonStyles';

const ResidentForm = ({ resident, onSave, onClose }) => {
  const { formData, updateField, handleSubmit } = useResidentForm(resident, onSave);
  return (
    <div
      className={adminDialogBackdropClass}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="resident-form-title" className={adminDialogPanelClass}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#303136] px-5 py-4 sm:px-6">
          <div>
            <h2 id="resident-form-title" className="text-lg font-semibold text-[#f4f4f5]">
              {resident ? 'Edit Resident' : 'Add New Resident'}
            </h2>
            <p className="mt-1 text-sm text-[#aeb4bf]">
              {resident ? `Update details for ${resident.name}` : 'Enter resident information'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close resident form"
            className="rounded-lg p-2 text-[#aeb4bf] transition-colors hover:bg-[#242629] hover:text-[#f4f4f5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a5a7ad] cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-h-[calc(92vh-150px)] overflow-y-auto px-5 py-4 sm:px-6">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#d8d9de]">
                Resident Name <span className="text-[#c99393]">*</span>
              </label>
              <input
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
                <label className="mb-1.5 block text-sm font-medium text-[#d8d9de]">
                  Flat Number <span className="text-[#c99393]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.flat}
                  onChange={(e) => updateField('flat', e.target.value)}
                  className={adminFormFieldClass}
                  placeholder="e.g., A-101"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#d8d9de]">
                  Type <span className="text-[#c99393]">*</span>
                </label>
                <select
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
                <label className="mb-1.5 block text-sm font-medium text-[#d8d9de]">
                  Contact Number <span className="text-[#c99393]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.contact}
                  onChange={(e) => updateField('contact', e.target.value)}
                  className={adminFormFieldClass}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#d8d9de]">
                  Email Address <span className="text-[#c99393]">*</span>
                </label>
                <input
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
                <label className="mb-1.5 block text-sm font-medium text-[#d8d9de]">
                  Maintenance Amount <span className="text-[#c99393]">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.maintenanceAmount}
                  onChange={(e) => updateField('maintenanceAmount', Number.parseFloat(e.target.value))}
                  className={adminFormFieldClass}
                  placeholder="3500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#d8d9de]">
                  Status <span className="text-[#c99393]">*</span>
                </label>
                <select
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
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-[#303136] px-5 py-4 sm:px-6">
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
            {resident ? 'Update Resident' : 'Add Resident'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResidentForm;
