import { useState } from 'react';
import { ArrowLeft, Building2, Check, Home, Phone, UserRound } from 'lucide-react';
import useResidentRegistrationForm from '../hooks/useResidentRegistrationForm';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';

const fieldClassName = 'w-full rounded-lg border border-[#36373d] bg-[#1d1e22] px-3 py-3 text-sm text-[#f4f4f5] outline-none transition duration-200 placeholder:text-[#858790] focus:border-[#9b85ee] focus:ring-2 focus:ring-[#9b85ee]/25';

const fields = [
  { name: 'name', label: 'Full name', icon: UserRound, autoComplete: 'name' },
  { name: 'phone', label: 'Phone number', icon: Phone, autoComplete: 'tel', type: 'tel' },
  { name: 'flatNo', label: 'Flat number', icon: Home, autoComplete: 'address-line2' },
  { name: 'wing', label: 'Building / block', icon: Building2 },
];

const ResidentRegistrationForm = ({ account, onComplete, onSignOut }) => {
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [signOutError, setSignOutError] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { formData, error, isSaving, updateField, handleSubmit } = useResidentRegistrationForm({ account, onComplete });

  const confirmLogout = async () => {
    setIsSigningOut(true);
    setSignOutError('');
    try {
      await onSignOut();
      setConfirmSignOut(false);
    } catch (logoutError) {
      setSignOutError(logoutError.message || 'Could not sign out. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setConfirmSignOut(true)}
        className="mb-6 inline-flex cursor-pointer items-center gap-2 text-sm text-[#b8bac2] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b9a8ff]"
      >
        <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.8} />
        Sign out
      </button>

      <section className="mb-7 border-b border-[#303136] pb-5">
        <h2 className="text-sm font-semibold text-[#f0f0f2]">Account</h2>
        <p className="mt-2 text-sm text-[#c5c6cd]">{formData.email}</p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-[#f0f0f2]">Resident details</h2>
          <p className="mt-1 text-sm leading-6 text-[#b8bac2]">
            Add the contact and flat information for your resident profile.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map(({ name, label, icon: Icon, autoComplete, type = 'text' }) => (
            <div key={name} className="min-w-0">
              <label htmlFor={`resident-${name}`} className="mb-1.5 block text-sm font-medium text-[#d9d9de]">
                {label}
              </label>
              <div className="relative">
                <Icon
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9b9da7]"
                  strokeWidth={1.8}
                />
                <input
                  id={`resident-${name}`}
                  name={name}
                  type={type}
                  value={formData[name]}
                  onChange={updateField}
                  autoComplete={autoComplete}
                  required
                  className={`${fieldClassName} pl-10`}
                />
              </div>
            </div>
          ))}
          <div className="min-w-0">
            <label htmlFor="resident-type" className="mb-1.5 block text-sm font-medium text-[#d9d9de]">
              Resident type
            </label>
            <select
              id="resident-type"
              name="type"
              value={formData.type}
              onChange={updateField}
              className={`${fieldClassName} cursor-pointer`}
            >
              <option value="Owner">Owner</option>
              <option value="Tenant">Tenant</option>
            </select>
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-[#75464a] bg-[#392629] px-3 py-2.5 text-sm text-[#f0b2b4]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#7659d9] px-5 text-sm font-semibold text-white transition duration-200 hover:bg-[#8368e2] active:scale-[0.99] disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b9a8ff]"
        >
          <Check aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
          {isSaving ? 'Saving details...' : 'Save and continue'}
        </button>
      </form>
      <ConfirmDialog
        isOpen={confirmSignOut}
        title="Sign out before finishing setup?"
        description="Your resident details will not be saved yet."
        confirmLabel="Sign out"
        error={signOutError}
        isLoading={isSigningOut}
        onConfirm={confirmLogout}
        onCancel={() => {
          setConfirmSignOut(false);
          setSignOutError('');
        }}
      />
    </div>
  );
};

export default ResidentRegistrationForm;
