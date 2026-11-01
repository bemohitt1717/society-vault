import { useState } from 'react';

const createInitialFormData = (resident) => ({
  name: resident?.name || '',
  flat: resident?.flat || '',
  type: resident?.type || 'Owner',
  contact: resident?.contact || '',
  email: resident?.email || '',
  maintenanceAmount: resident?.maintenanceAmount ?? 3500,
  status: resident?.status || 'Active',
});

const useResidentForm = (resident, onSave) => {
  const [formData, setFormData] = useState(() => createInitialFormData(resident));

  const updateField = (field, value) => {
    setFormData((currentData) => ({ ...currentData, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(formData);
  };

  return { formData, updateField, handleSubmit };
};

export default useResidentForm;
