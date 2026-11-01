import { useEffect, useState } from 'react';
import { getApiErrorMessage } from '../../../../services/api/http';
import { getCurrentUser, saveAdminAccountProfile } from '../../../auth/services/authService';

const useAdminProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then((user) => {
        if (!user || user.role !== 'admin') {
          throw new Error('Administrator account details could not be loaded.');
        }
        if (active) {
          setName(user.name || '');
          setEmail(user.email || '');
        }
      })
      .catch((loadError) => {
        if (active) setError(getApiErrorMessage(loadError));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleChange = (event) => {
    setName(event.target.value);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Enter your name before saving.');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      const user = await saveAdminAccountProfile(trimmedName);
      setName(user.name || trimmedName);
      window.dispatchEvent(new CustomEvent('societyvault:profile-updated', { detail: user }));
      setSuccess('Your profile has been updated.');
    } catch (saveError) {
      setError(getApiErrorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  };

  return { name, email, isLoading, isSaving, error, success, handleChange, handleSubmit };
};

export default useAdminProfile;
