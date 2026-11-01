import { useState } from 'react';

const createInitialFormData = (income) => ({
  description: income?.description || '',
  category: income?.category || '',
  amount: income?.amount?.toString() || '',
  date: income?.date || new Date().toISOString().split('T')[0],
  paymentMode: income?.paymentMode || '',
  transactionRef: income?.transactionRef || '',
  resident: income?.resident || '',
  flat: income?.flat || '',
  remarks: income?.remarks || '',
});

const useIncomeForm = (income, onSave) => {
  const [formData, setFormData] = useState(() => createInitialFormData(income));
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((currentData) => ({ ...currentData, [field]: value }));
    setErrors((currentErrors) => currentErrors[field]
      ? { ...currentErrors, [field]: '' }
      : currentErrors);
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

  return { formData, errors, handleChange, handleSubmit };
};

export default useIncomeForm;
