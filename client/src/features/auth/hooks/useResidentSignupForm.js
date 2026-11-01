import { useState } from 'react';
import { registerUser } from '../services/authService';
import { getApiErrorMessage } from '../../../services/api/http';

const useResidentSignupForm = (onRegistered) => {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Check both fields and try again.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const user = await registerUser(formData.email, formData.password, 'resident');
      onRegistered(user);
    } catch (registrationError) {
      console.error('[Resident signup] Account creation failed:', registrationError);
      setError(getApiErrorMessage(registrationError));
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, showPasswords, setShowPasswords, error, isLoading, updateField, handleSubmit };
};

export default useResidentSignupForm;
