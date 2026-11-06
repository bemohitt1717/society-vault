import { useState } from 'react';
import { registerUser } from '../services/authService';
import { getApiErrorMessage } from '../../../services/api/http';

const useResidentSignupForm = (onRegistered) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
    setIsLoading(true);
    setError('');
    try {
      const { email, password } = formData;
      const user = await registerUser({ email, password });
      onRegistered(user);
    } catch (registrationError) {
      setError(getApiErrorMessage(registrationError));
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, showPasswords, setShowPasswords, error, isLoading, updateField, handleSubmit };
};

export default useResidentSignupForm;
