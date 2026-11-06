import { useState } from 'react';
import { loginUser } from '../services/authService';
import { getApiErrorMessage } from '../../../services/api/http';

const useLoginForm = (selectedRole, onAuthenticated) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const user = await loginUser(email, password, selectedRole);
      onAuthenticated(user);
    } catch (loginError) {
      setError(getApiErrorMessage(loginError));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isLoading,
    error,
    dismissError: () => setError(''),
    handleSubmit,
  };
};

export default useLoginForm;
