import { Eye, EyeOff, LockKeyhole, LogIn, Mail } from 'lucide-react';
import { InputGroup, Label, TextField } from '@heroui/react';
import GoogleLoginButton from './GoogleLoginButton';
import AuthSubmitButton from './AuthSubmitButton';
import useLoginForm from '../hooks/useLoginForm';
import ErrorToast from '../../../components/ui/ErrorToast';

const LoginForm = ({ onSwitchToSignup, onBack, selectedRole, onAuthenticated }) => {
  const {
    email, setEmail, password, setPassword, showPassword, setShowPassword,
    isLoading, error, dismissError, handleSubmit,
  } = useLoginForm(selectedRole, onAuthenticated);
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Back to Role Selection Button */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex cursor-pointer items-center gap-2 text-sm text-[#94a1b2] hover:text-[#fffffe] transition-colors mb-4 cursor-pointer"
        >
          <span>←</span> Change role
        </button>
      )}

      {/* Email Input */}
      <TextField fullWidth name="email" isRequired>
        <Label className="mb-2 text-sm font-medium text-[#fffffe]">Email</Label>
        <InputGroup
          fullWidth
          className="border border-[#2e2f33] bg-[#242629] text-[#fffffe] focus-within:border-[#7f5af0] focus-within:ring-2 focus-within:ring-[#7f5af0]/40"
        >
          <InputGroup.Prefix>
            <Mail aria-hidden="true" className="size-4 text-[#94a1b2]" />
          </InputGroup.Prefix>
          <InputGroup.Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="text-[#fffffe] placeholder:text-[#72757e]"
          />
        </InputGroup>
      </TextField>

      {/* Password Input */}
      <TextField fullWidth name="password" isRequired>
        <Label className="mb-2 text-sm font-medium text-[#fffffe]">Password</Label>
        <InputGroup
          fullWidth
          className="border border-[#2e2f33] bg-[#242629] text-[#fffffe] focus-within:border-[#7f5af0] focus-within:ring-2 focus-within:ring-[#7f5af0]/40"
        >
          <InputGroup.Prefix>
            <LockKeyhole aria-hidden="true" className="size-4 text-[#94a1b2]" />
          </InputGroup.Prefix>
          <InputGroup.Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="text-[#fffffe] placeholder:text-[#72757e]"
          />
          <InputGroup.Suffix>
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#94a1b2] transition-colors hover:text-[#fffffe]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </InputGroup.Suffix>
        </InputGroup>
      </TextField>

      {error && <ErrorToast message={error} onDismiss={dismissError} />}

      <AuthSubmitButton
        icon={LogIn}
        label="Sign In"
        loadingLabel="Signing in..."
        isLoading={isLoading}
      />

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#2e2f33]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[#16161a] text-[#72757e]">or</span>
        </div>
      </div>

      {selectedRole === 'resident' && (
        <GoogleLoginButton onAuthenticated={onAuthenticated} />
      )}

      {/* Sign Up Link */}
      {selectedRole === 'resident' && (
        <p className="text-center text-sm text-[#94a1b2] mt-6">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-[#7f5af0] hover:underline font-medium cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      )}
    </form>
  );
};

export default LoginForm;
