import { useState } from 'react';

const useForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return { email, setEmail, isLoading, handleSubmit };
};

export default useForgotPasswordForm;
