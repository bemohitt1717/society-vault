import { useState } from 'react';

const createInitialFormData = (expense) => ({
  description: expense?.description || '',
  category: expense?.category || '',
  amount: expense?.amount?.toString() || '',
  date: expense?.date || new Date().toISOString().split('T')[0],
  vendor: expense?.vendor || '',
  paymentMode: expense?.paymentMode || '',
  paymentStatus: expense?.paymentStatus || 'Pending',
  transactionRef: expense?.transactionRef || '',
  remarks: expense?.remarks || '',
});

const useExpenseForm = (expense, onSave) => {
  const [formData, setFormData] = useState(() => createInitialFormData(expense));
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
    if (!formData.vendor.trim()) validationErrors.vendor = 'Vendor/Payee is required';
    if (!formData.paymentMode) validationErrors.paymentMode = 'Payment mode is required';
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    onSave({ ...formData, amount: Number.parseFloat(formData.amount) });
  };

  return { formData, errors, handleChange, handleSubmit };
};

export default useExpenseForm;
