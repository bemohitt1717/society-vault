import { Eye, EyeOff, LockKeyhole, Mail, UserPlus, UserRound } from 'lucide-react';
import { Checkbox, InputGroup, Label, TextField } from '@heroui/react';
import GoogleLoginButton from './GoogleLoginButton';
import AuthSubmitButton from './AuthSubmitButton';
import useSignupForm from '../hooks/useSignupForm';

const SignupForm = ({ onSwitchToLogin, onBack }) => {
  const {
    formData, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword,
    agreeToTerms, setAgreeToTerms, isLoading, passwordStrength, handleChange, handleSubmit,
  } = useSignupForm();
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Back to Role Selection Button */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-[#94a1b2] hover:text-[#fffffe] transition-colors mb-4 cursor-pointer"
        >
          <span>←</span> Change role
        </button>
      )}

      {/* Full Name Input */}
      <TextField fullWidth name="fullName" isRequired>
        <Label className="mb-2 text-sm font-medium text-[#fffffe]">Full Name</Label>
        <InputGroup
          fullWidth
          className="border border-[#2e2f33] bg-[#242629] text-[#fffffe] focus-within:border-[#7f5af0] focus-within:ring-2 focus-within:ring-[#7f5af0]/40"
        >
          <InputGroup.Prefix>
            <UserRound aria-hidden="true" className="size-4 text-[#94a1b2]" />
          </InputGroup.Prefix>
          <InputGroup.Input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="text-[#fffffe] placeholder:text-[#72757e]"
          />
        </InputGroup>
      </TextField>

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
            id="signup-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="text-[#fffffe] placeholder:text-[#72757e]"
          />
        </InputGroup>
      </TextField>

      {/* Password Input with Strength Indicator */}
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
            id="signup-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
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
        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#94a1b2]">Password strength:</span>
              <span className="text-xs font-medium" style={{ color: passwordStrength.color }}>
                {passwordStrength.strength}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#2e2f33] rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{ 
                  width: passwordStrength.width, 
                  backgroundColor: passwordStrength.color 
                }}
              />
            </div>
          </div>
        )}
      </TextField>

      {/* Confirm Password Input */}
      <TextField fullWidth name="confirmPassword" isRequired>
        <Label className="mb-2 text-sm font-medium text-[#fffffe]">Confirm Password</Label>
        <InputGroup
          fullWidth
          className="border border-[#2e2f33] bg-[#242629] text-[#fffffe] focus-within:border-[#7f5af0] focus-within:ring-2 focus-within:ring-[#7f5af0]/40"
        >
          <InputGroup.Prefix>
            <LockKeyhole aria-hidden="true" className="size-4 text-[#94a1b2]" />
          </InputGroup.Prefix>
          <InputGroup.Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className="text-[#fffffe] placeholder:text-[#72757e]"
          />
          <InputGroup.Suffix>
            <button
              type="button"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-[#94a1b2] transition-colors hover:text-[#fffffe]"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </InputGroup.Suffix>
        </InputGroup>
      </TextField>

      {/* Terms and Conditions */}
      <div className="flex flex-wrap items-center gap-x-1 gap-y-2 text-sm text-[#c4c5ca]">
        <Checkbox
          name="terms"
          isRequired
          isSelected={agreeToTerms}
          onChange={setAgreeToTerms}
          className="inline-flex w-auto shrink-0"
        >
          <Checkbox.Content className="flex items-center gap-2 text-sm text-[#c4c5ca]">
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            I agree to the
          </Checkbox.Content>
        </Checkbox>
        <span className="inline-flex items-center gap-x-1 text-sm leading-5">
          <a href="#" className="text-[#7f5af0] hover:underline">
            Terms & Conditions
          </a>{' '}
          and{' '}
          <a href="#" className="text-[#7f5af0] hover:underline">
            Privacy Policy
          </a>
        </span>
      </div>

      {/* Sign Up Button */}
      <AuthSubmitButton
        icon={UserPlus}
        label="Sign Up"
        loadingLabel="Creating account..."
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

      {/* Google Login */}
      <GoogleLoginButton />

      {/* Sign In Link */}
      <p className="text-center text-sm text-[#94a1b2] mt-6">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-[#7f5af0] hover:underline font-medium cursor-pointer cursor-pointer"
        >
          Sign In
        </button>
      </p>
    </form>
  );
};

export default SignupForm;

