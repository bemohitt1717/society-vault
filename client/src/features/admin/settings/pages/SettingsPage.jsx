import { Building2, DollarSign, Plus, Save, Tag, Users, Trash2 } from 'lucide-react';
import useSettingsPage from '../hooks/useSettingsPage';
import {
  adminFormFieldClass,
  adminPrimaryButtonClass,
} from '../../../../components/ui/actionButtonStyles';
import LoadingState from '../../../../components/ui/LoadingState';

const SettingsPage = () => {
  const {
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
  } = useSettingsPage();

  const sections = [
    { id: 'society', label: 'Society Details', icon: Building2 },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'financial', label: 'Financial Settings', icon: DollarSign },
    { id: 'users', label: 'Users & Roles', icon: Users },
  ];

  const renderCategoryGroup = (type, title) => (
    <section>
      <h3 className="mb-3 text-lg font-semibold text-[#fffffe]">{title}</h3>
      {categories[type].length ? (
        <div className="space-y-2">
          {categories[type].map((category) => (
            <div key={category._id || category.id} className="flex items-center justify-between gap-4 rounded-lg border border-[#2e2f33] bg-[#16161a] p-3">
              <span className="text-sm text-[#fffffe]">{category.name}</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`text-sm ${category.active ? 'text-[#8db5a2]' : 'text-[#aeb4bf]'}`}
                >
                  {category.active ? 'Active' : 'Inactive'}
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${category.name}`}
                  onClick={() => removeCategory(category)}
                  className="rounded p-1 text-[#aeb4bf] hover:bg-[#242629] hover:text-[#c99393]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : <p className="text-sm text-[#94a1b2]">No categories in the database yet.</p>}
    </section>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'society':
        return (
          <form onSubmit={saveSettings} className="space-y-5">
            <h3 className="text-lg font-semibold text-[#fffffe]">Society Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                ['name', 'Society Name', 'text'],
                ['registrationNumber', 'Registration Number', 'text'],
                ['email', 'Email', 'email'],
                ['phone', 'Phone', 'tel'],
              ].map(([field, label, type]) => (
                <label key={field} className="block text-sm font-medium text-[#fffffe]">
                  {label}
                  <input
                    type={type}
                    value={settings[field]}
                    onChange={(event) => updateSettingField(field, event.target.value)}
                    className={`${adminFormFieldClass} mt-1.5`}
                  />
                </label>
              ))}
              <label className="block text-sm font-medium text-[#fffffe] md:col-span-2">
                Address
                <textarea
                  rows="3"
                  value={settings.address}
                  onChange={(event) => updateSettingField('address', event.target.value)}
                  className={`${adminFormFieldClass} mt-1.5 resize-none`}
                />
              </label>
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={isSaving} className={adminPrimaryButtonClass}>
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        );
      case 'categories':
        return (
          <div className="space-y-7">
            <form onSubmit={addCategory} className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_180px_auto]">
              <input
                value={newCategory.name}
                onChange={(event) => setNewCategory((current) => ({ ...current, name: event.target.value }))}
                placeholder="Category name"
                aria-label="Category name"
                required
                className={adminFormFieldClass}
              />
              <select
                value={newCategory.type}
                onChange={(event) => setNewCategory((current) => ({ ...current, type: event.target.value }))}
                aria-label="Category type"
                className={`${adminFormFieldClass} cursor-pointer`}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <button type="submit" className={adminPrimaryButtonClass}>
                <Plus className="h-4 w-4" />
                Add Category
              </button>
            </form>
            {renderCategoryGroup('income', 'Income Categories')}
            {renderCategoryGroup('expense', 'Expense Categories')}
          </div>
        );
      case 'financial':
        return (
          <form onSubmit={saveSettings} className="space-y-5">
            <h3 className="text-lg font-semibold text-[#fffffe]">Financial Configuration</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-[#fffffe]">
                Financial Year
                <input
                  value={settings.financialYear}
                  onChange={(event) => updateSettingField('financialYear', event.target.value)}
                  className={`${adminFormFieldClass} mt-1.5`}
                />
              </label>
              <label className="block text-sm font-medium text-[#fffffe]">
                Currency
                <input value="INR (₹)" readOnly className={`${adminFormFieldClass} mt-1.5 opacity-70`} />
              </label>
              <label className="block text-sm font-medium text-[#fffffe]">
                Default Maintenance Amount (₹)
                <input
                  type="number"
                  min="0"
                  value={settings.maintenanceAmount}
                  onChange={(event) => updateSettingField('maintenanceAmount', event.target.value)}
                  className={`${adminFormFieldClass} mt-1.5`}
                />
              </label>
              <label className="block text-sm font-medium text-[#fffffe]">
                Due Date (Day of Month)
                <input
                  type="number"
                  min="1"
                  max="28"
                  value={settings.dueDate}
                  onChange={(event) => updateSettingField('dueDate', event.target.value)}
                  className={`${adminFormFieldClass} mt-1.5`}
                />
              </label>
              <label className="block text-sm font-medium text-[#fffffe]">
                Late Fee Percentage (%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={settings.lateFeePercentage}
                  onChange={(event) => updateSettingField('lateFeePercentage', event.target.value)}
                  className={`${adminFormFieldClass} mt-1.5`}
                />
              </label>
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={isSaving} className={adminPrimaryButtonClass}>
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        );
      case 'users':
        return (
          <section>
            <h3 className="mb-4 text-lg font-semibold text-[#fffffe]">Administrator Accounts</h3>
            {users.length ? (
              <div className="overflow-x-auto rounded-xl border border-[#2e2f33]">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2e2f33] text-left text-xs uppercase tracking-wider text-[#94a1b2]">
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2e2f33]">
                    {users.map((user) => (
                      <tr key={user._id || user.id}>
                        <td className="px-4 py-3 text-sm text-[#fffffe]">{user.name || user.email}</td>
                        <td className="px-4 py-3 text-sm text-[#94a1b2]">{user.email}</td>
                        <td className="px-4 py-3 text-sm text-[#b8bec8]">{user.role}</td>
                        <td className="px-4 py-3 text-sm text-[#8db5a2]">{user.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="text-sm text-[#94a1b2]">No administrator accounts in the database yet.</p>}
            <p className="mt-3 text-xs text-[#94a1b2]">Administrator accounts are managed by the system administrator.</p>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {error && <p role="alert" className="text-sm text-[#f0b2b4]">{error}</p>}
      {success && <p role="status" className="text-sm text-[#8db5a2]">{success}</p>}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <nav aria-label="Settings sections" className="space-y-1 rounded-2xl border border-[#26262b] bg-[#1a1a1e] p-2 lg:col-span-3">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveSection(id)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                activeSection === id ? 'bg-[#5c5197] text-white' : 'text-[#94a1b2] hover:bg-[#242629] hover:text-[#fffffe]'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </nav>
        <div className="min-h-64 rounded-2xl border border-[#26262b] bg-[#1a1a1e] p-6 lg:col-span-9">
          {isLoading ? <LoadingState label="Loading settings..." className="min-h-40" /> : renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
