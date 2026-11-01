import { useState } from 'react';

const getPasswordStrength = (password) => {
  if (!password) return { strength: '', color: '', width: '0%' };

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 2) return { strength: 'Weak', color: '#ff6b6b', width: '33%' };
  if (score <= 3) return { strength: 'Medium', color: '#feca57', width: '66%' };
  return { strength: 'Strong', color: '#2cb67d', width: '100%' };
};

const useSignupForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return {
    formData,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    agreeToTerms,
    setAgreeToTerms,
    isLoading,
    passwordStrength: getPasswordStrength(formData.password),
    handleChange,
    handleSubmit,
  };
};

export default useSignupForm;
