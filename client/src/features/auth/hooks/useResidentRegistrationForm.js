import { useState } from 'react';
import { getApiErrorMessage } from '../../../services/api/http';

const useResidentRegistrationForm = ({ account, onComplete }) => {
  const [formData, setFormData] = useState(() => ({
    name: account?.profile?.name || '',
    email: account?.email || '',
    phone: account?.profile?.phone || '',
    flatNo: account?.profile?.flatNo || '',
    wing: account?.profile?.wing || '',
    password: '',
    confirmPassword: '',
  }));
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!account?.hasPassword && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Check both fields and try again.');
      return;
    }
    setIsSaving(true);
    try {
      await onComplete({
        name: formData.name.trim(),
        email: formData.email,
        phone: formData.phone.trim(),
        flatNo: formData.flatNo.trim(),
        wing: formData.wing.trim(),
        ...(!account?.hasPassword ? { password: formData.password } : {}),
      });
    } catch (saveError) {
      console.error('[Resident profile setup] Save failed:', saveError);
      setError(getApiErrorMessage(saveError));
      setIsSaving(false);
    }
  };

  return { formData, error, isSaving, updateField, handleSubmit };
};

export default useResidentRegistrationForm;
