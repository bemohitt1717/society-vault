import { useState } from 'react';
import { getApiErrorMessage } from '../../../services/api/http';

const useResidentRegistrationForm = ({ account, onComplete }) => {
  const [formData, setFormData] = useState(() => ({
    name: account?.profile?.name || '',
    email: account?.email || '',
    phone: account?.profile?.phone || '',
    flatNo: account?.profile?.flatNo || '',
    wing: account?.profile?.wing || '',
    type: account?.profile?.type || 'Owner',
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
    setIsSaving(true);
    try {
      await onComplete({
        name: formData.name.trim(),
        email: formData.email,
        phone: formData.phone.trim(),
        flatNo: formData.flatNo.trim(),
        wing: formData.wing.trim(),
        type: formData.type,
      });
    } catch (saveError) {
      setError(getApiErrorMessage(saveError));
      setIsSaving(false);
    }
  };

  return { formData, error, isSaving, updateField, handleSubmit };
};

export default useResidentRegistrationForm;
