import { Mail, Send } from 'lucide-react';
import { InputGroup, Label, TextField } from '@heroui/react';
import AuthSubmitButton from './AuthSubmitButton';
import useForgotPasswordForm from '../hooks/useForgotPasswordForm';

const ForgotPasswordForm = ({ onBackToLogin }) => {
  const { email, setEmail, isLoading, handleSubmit } = useForgotPasswordForm();
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#fffffe] mb-2">Reset your password</h2>
        <p className="text-sm text-[#94a1b2]">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

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
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="text-[#fffffe] placeholder:text-[#72757e]"
          />
        </InputGroup>
      </TextField>

      {/* Send Reset Link Button */}
      <AuthSubmitButton
        icon={Send}
        label="Send Reset Link"
        loadingLabel="Sending reset link..."
        isLoading={isLoading}
      />

      {/* Back to Sign In Link */}
      <p className="text-center text-sm text-[#94a1b2] mt-6">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-[#7f5af0] hover:underline font-medium cursor-pointer cursor-pointer"
        >
          ← Back to Sign In
        </button>
      </p>
    </form>
  );
};

export default ForgotPasswordForm;

