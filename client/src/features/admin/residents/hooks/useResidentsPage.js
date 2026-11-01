import { useState } from 'react';
import { residents as initialResidents } from '../data/mockResidentsData';

const tabs = [
  { id: 'residents', label: 'Residents & Flats' },
  { id: 'dues', label: 'Maintenance Dues' },
  { id: 'payments', label: 'Payment History' },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Paid':
    case 'Active':
      return 'text-[#8db5a2]';
    case 'Pending':
      return 'text-[#d2b88e]';
    case 'Overdue':
      return 'text-[#c99393]';
    default:
      return 'text-[#aeb4bf]';
  }
};

const useResidentsPage = () => {
  const [activeTab, setActiveTab] = useState('residents');
  const [residents, setResidents] = useState(initialResidents);
  const [showForm, setShowForm] = useState(false);
  const [editingResident, setEditingResident] = useState(null);

  const addResident = () => {
    setEditingResident(null);
    setShowForm(true);
  };

  const editResident = (resident) => {
    setEditingResident(resident);
    setShowForm(true);
  };

  const deleteResident = (residentId) => {
    if (!window.confirm('Are you sure you want to delete this resident?')) return;
    setResidents((currentResidents) => currentResidents.filter((resident) => resident.id !== residentId));
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingResident(null);
  };

  const saveResident = (residentData) => {
    if (editingResident) {
      setResidents((currentResidents) => currentResidents.map((resident) =>
        resident.id === editingResident.id
          ? { ...resident, ...residentData, id: resident.id, outstanding: resident.outstanding }
          : resident));
    } else {
      setResidents((currentResidents) => [...currentResidents, {
        ...residentData,
        id: `RES-${String(currentResidents.length + 1).padStart(3, '0')}`,
        outstanding: 0,
      }]);
    }

    closeForm();
  };

  return {
    activeTab,
    setActiveTab,
    residents,
    tabs,
    showForm,
    editingResident,
    addResident,
    editResident,
    deleteResident,
    closeForm,
    saveResident,
    getStatusColor,
  };
};

export default useResidentsPage;
