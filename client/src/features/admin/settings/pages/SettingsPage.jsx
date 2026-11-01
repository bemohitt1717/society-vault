import { Building2, Tag, DollarSign, Users, Save, Plus } from 'lucide-react';
import { societyDetails, categories, financialSettings, users } from '../data/mockSettingsData';
import useSettingsPage from '../hooks/useSettingsPage';
import {
  adminFormFieldClass,
  adminPrimaryButtonClass,
} from '../../../../components/ui/actionButtonStyles';

const SettingsPage = () => {
  const { activeSection, setActiveSection } = useSettingsPage();

  const sections = [
    { id: 'society', label: 'Society Details', icon: Building2 },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'financial', label: 'Financial Settings', icon: DollarSign },
    { id: 'users', label: 'Users & Roles', icon: Users }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'society':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#fffffe] mb-4">Society Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#fffffe] mb-1.5">Society Name</label>
                  <input
                    type="text"
                    defaultValue={societyDetails.name}
                    className={adminFormFieldClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#fffffe] mb-1.5">Registration Number</label>
                  <input
                    type="text"
                    defaultValue={societyDetails.registrationNumber}
                    className={adminFormFieldClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#fffffe] mb-1.5">Address</label>
                  <textarea
                    rows="3"
                    defaultValue={societyDetails.address}
                    className={`${adminFormFieldClass} resize-none`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#fffffe] mb-1.5">Email</label>
                  <input
                    type="email"
                    defaultValue={societyDetails.email}
                    className={adminFormFieldClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#fffffe] mb-1.5">Phone</label>
                  <input
                    type="tel"
                    defaultValue={societyDetails.phone}
                    className={adminFormFieldClass}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button className={adminPrimaryButtonClass}>
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        );

      case 'categories':
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#fffffe]">Income Categories</h3>
                <button className={adminPrimaryButtonClass}>
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </div>
              <div className="space-y-2">
                {categories.income.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-3 bg-[#16161a] border border-[#2e2f33] rounded-lg">
                    <span className="text-sm text-[#fffffe]">{cat.name}</span>
                    <span className={`text-sm ${cat.active ? 'text-[#8db5a2]' : 'text-[#aeb4bf]'}`}>
                      {cat.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#fffffe]">Expense Categories</h3>
                <button className={adminPrimaryButtonClass}>
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </div>
              <div className="space-y-2">
                {categories.expense.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-3 bg-[#16161a] border border-[#2e2f33] rounded-lg">
                    <span className="text-sm text-[#fffffe]">{cat.name}</span>
                    <span className={`text-sm ${cat.active ? 'text-[#8db5a2]' : 'text-[#aeb4bf]'}`}>
                      {cat.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'financial':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#fffffe] mb-4">Financial Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#fffffe] mb-1.5">Financial Year</label>
                  <input
                    type="text"
                    defaultValue={financialSettings.financialYear}
                    className={adminFormFieldClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#fffffe] mb-1.5">Currency</label>
                  <select
                    defaultValue={financialSettings.currency}
                    className={`${adminFormFieldClass} cursor-pointer`}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#fffffe] mb-1.5">Default Maintenance Amount (₹)</label>
                  <input
                    type="number"
                    defaultValue={financialSettings.maintenanceAmount}
                    className={adminFormFieldClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#fffffe] mb-1.5">Due Date (Day of Month)</label>
                  <input
                    type="number"
                    min="1"
                    max="28"
                    defaultValue={financialSettings.dueDate}
                    className={adminFormFieldClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#fffffe] mb-1.5">Late Fee Percentage (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    defaultValue={financialSettings.lateFeePercentage}
                    className={adminFormFieldClass}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button className={adminPrimaryButtonClass}>
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#fffffe]">User Management</h3>
              <button className={adminPrimaryButtonClass}>
                <Plus className="w-4 h-4" />
                Add User
              </button>
            </div>
            <div className="bg-[#16161a] border border-[#2e2f33] rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2e2f33]">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#94a1b2] uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2e2f33]">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-[#1e1e22] transition-colors">
                      <td className="px-4 py-3 text-sm text-[#fffffe]">{user.name}</td>
                      <td className="px-4 py-3 text-sm text-[#94a1b2]">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-[#b8bec8]">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-medium ${
                          user.status === 'Active' ? 'text-[#8db5a2]' : 'text-[#aeb4bf]'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Sidebar */}
        <div className="lg:col-span-3">
          <div className="bg-[#1a1a1e] border border-[#26262b] rounded-2xl p-2 space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer text-left ${
                    activeSection === section.id
                      ? 'bg-[#5c5197] text-white'
                      : 'text-[#94a1b2] hover:text-[#fffffe] hover:bg-[#242629]'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-9">
          <div className="bg-[#1a1a1e] border border-[#26262b] rounded-2xl p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
