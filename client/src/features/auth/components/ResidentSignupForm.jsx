import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import useResidentSignupForm from '../hooks/useResidentSignupForm';
import GoogleLoginButton from './GoogleLoginButton';

const fieldClassName = 'w-full rounded-lg border border-[#36373d] bg-[#1d1e22] px-3 py-3 text-sm text-[#f4f4f5] outline-none transition duration-200 placeholder:text-[#858790] focus:border-[#9b85ee] focus:ring-2 focus:ring-[#9b85ee]/25';

const ResidentSignupForm = ({ onRegistered, onBack, onSwitchToLogin }) => {
  const { formData, showPasswords, setShowPasswords, error, isLoading, updateField, handleSubmit } = useResidentSignupForm(onRegistered);
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex cursor-pointer items-center gap-2 text-sm text-[#b8bac2] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b9a8ff]"
      >
        <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={1.8} />
        Back to sign in
      </button>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="resident-signup-email" className="mb-1.5 block text-sm font-medium text-[#d9d9de]">
            Email address
          </label>
          <div className="relative">
            <Mail aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9b9da7]" strokeWidth={1.8} />
            <input
              id="resident-signup-email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={updateField}
              placeholder="you@example.com"
              required
              className={`${fieldClassName} pl-10`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="resident-signup-password" className="mb-1.5 block text-sm font-medium text-[#d9d9de]">
            Create password
          </label>
          <div className="relative">
            <LockKeyhole aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9b9da7]" strokeWidth={1.8} />
            <input
              id="resident-signup-password"
              name="password"
              type={showPasswords ? 'text' : 'password'}
              autoComplete="new-password"
              minLength={8}
              value={formData.password}
              onChange={updateField}
              placeholder="At least 8 characters"
              required
              className={`${fieldClassName} px-10`}
            />
            <button
              type="button"
              aria-label={showPasswords ? 'Hide passwords' : 'Show passwords'}
              onClick={() => setShowPasswords((visible) => !visible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#aeb0b9] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b9a8ff]"
            >
              {showPasswords ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-[#75464a] bg-[#392629] px-3 py-2.5 text-sm text-[#f0b2b4]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#7659d9] px-5 text-sm font-semibold text-white transition duration-200 hover:bg-[#8368e2] active:scale-[0.99] disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b9a8ff]"
        >
          <span>{isLoading ? 'Creating account...' : 'Continue'}</span>
          {!isLoading && <ArrowRight aria-hidden="true" className="size-4" />}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-[#858790]">
        <span className="h-px flex-1 bg-[#36373d]" />
        or sign up with
        <span className="h-px flex-1 bg-[#36373d]" />
      </div>
      <GoogleLoginButton onAuthenticated={onRegistered} buttonLabel="Continue with Google" />

      <p className="mt-6 text-center text-sm text-[#b8bac2]">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="cursor-pointer font-medium text-[#b9a8ff] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b9a8ff]"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};

export default ResidentSignupForm;
