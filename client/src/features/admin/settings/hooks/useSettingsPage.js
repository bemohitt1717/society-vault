import { useCallback, useEffect, useState } from 'react';
import {
  createCategory,
  deleteCategory,
  getSettings,
  updateCategory,
  updateSettings,
} from '../../../../services/api/adminApi';
import { getApiErrorMessage } from '../../../../services/api/http';

const emptySettings = {
  name: '',
  address: '',
  email: '',
  phone: '',
  registrationNumber: '',
  financialYear: '',
  currency: 'INR',
  maintenanceAmount: 0,
  dueDate: 5,
  lateFeePercentage: 0,
};

const useSettingsPage = () => {
  const [activeSection, setActiveSection] = useState('society');
  const [settings, setSettings] = useState(emptySettings);
  const [categories, setCategories] = useState({ income: [], expense: [] });
  const [users, setUsers] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', type: 'income' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const refreshSettings = useCallback(async () => {
    const data = await getSettings();
    setSettings({ ...emptySettings, ...data.society });
    setCategories(data.categories || { income: [], expense: [] });
    setUsers(data.users || []);
  }, []);

  useEffect(() => {
    let active = true;
    getSettings()
      .then((data) => {
        if (!active) return;
        setSettings({ ...emptySettings, ...data.society });
        setCategories(data.categories || { income: [], expense: [] });
        setUsers(data.users || []);
      })
      .catch((requestError) => {
        if (active) setError(getApiErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, []);

  const updateSettingField = (field, value) => {
    setSettings((current) => ({ ...current, [field]: value }));
    setSuccess('');
  };

  const saveSettings = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      const saved = await updateSettings({
        ...settings,
        maintenanceAmount: Number(settings.maintenanceAmount),
        dueDate: Number(settings.dueDate),
        lateFeePercentage: Number(settings.lateFeePercentage),
      });
      setSettings((current) => ({ ...current, ...saved }));
      setSuccess('Settings saved.');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  };

  const addCategory = async (event) => {
    event.preventDefault();
    if (!newCategory.name.trim()) return;
    setError('');
    setSuccess('');
    try {
      await createCategory({ name: newCategory.name.trim(), type: newCategory.type });
      setNewCategory((current) => ({ ...current, name: '' }));
      await refreshSettings();
      setSuccess('Category added.');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  };

  const toggleCategory = async (category) => {
    setError('');
    setSuccess('');
    try {
      await updateCategory(category._id || category.id, {
        name: category.name,
        type: category.type,
        active: !category.active,
      });
      await refreshSettings();
      setSuccess('Category updated.');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  };

  const removeCategory = async (category) => {
    if (!window.confirm(`Delete the "${category.name}" category?`)) return;
    setError('');
    setSuccess('');
    try {
      await deleteCategory(category._id || category.id);
      await refreshSettings();
      setSuccess('Category removed.');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  };

  return {
    activeSection,
    setActiveSection,
    settings,
    categories,
    users,
    newCategory,
    setNewCategory,
    isLoading,
    isSaving,
    error,
    success,
    updateSettingField,
    saveSettings,
    addCategory,
    toggleCategory,
    removeCategory,
  };
};

export default useSettingsPage;
