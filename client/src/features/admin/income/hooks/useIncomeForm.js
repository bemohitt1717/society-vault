import { useState } from 'react';

const createInitialFormData = (income) => ({
  description: income?.description || '',
  category: income?.category || '',
  amount: income?.amount?.toString() || '',
  date: income?.date || new Date().toISOString().split('T')[0],
  paymentMode: income?.paymentMode || '',
  transactionRef: income?.transactionRef || '',
  residentId: income?.residentId || '',
  residentName: income?.residentName || (typeof income?.resident === 'string' ? income.resident : ''),
  flat: income?.flat || '',
  remarks: income?.remarks || '',
});

const useIncomeForm = (income, residents, onSave) => {
  const [formData, setFormData] = useState(() => createInitialFormData(income));
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((currentData) => ({ ...currentData, [field]: value }));
    setErrors((currentErrors) => currentErrors[field]
      ? { ...currentErrors, [field]: '' }
      : currentErrors);
  };

  const handleResidentChange = (residentId) => {
    const resident = residents.find((item) => item.id === residentId);
    setFormData((currentData) => ({
      ...currentData,
      residentId,
      residentName: resident?.name || '',
      flat: resident?.flat || '',
    }));
    setErrors((currentErrors) => ({ ...currentErrors, residentId: '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = {};
    if (!formData.description.trim()) validationErrors.description = 'Description is required';
    if (!formData.category) validationErrors.category = 'Category is required';
    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) validationErrors.amount = 'Valid amount is required';
    if (!formData.date) validationErrors.date = 'Date is required';
    if (!formData.paymentMode) validationErrors.paymentMode = 'Payment mode is required';
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    onSave({ ...formData, amount: Number.parseFloat(formData.amount) });
  };

  return { formData, errors, handleChange, handleResidentChange, handleSubmit };
};

export default useIncomeForm;
