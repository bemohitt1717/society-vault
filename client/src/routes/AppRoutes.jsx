import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import RequireRole from './RequireRole';
import AuthPage from '../features/auth/pages/AuthPage';
import DashboardLayout from '../features/admin/dashboard/components/DashboardLayout';
import DashboardOverview from '../features/admin/dashboard/pages/DashboardOverview';
import IncomePage from '../features/admin/income/pages/IncomePage';
import ExpensePage from '../features/admin/expenses/pages/ExpensePage';
import ResidentsPage from '../features/admin/residents/pages/ResidentsPage';
import ReportsPage from '../features/admin/reports/pages/ReportsPage';
import AuditLogsPage from '../features/admin/audit/pages/AuditLogsPage';
import SettingsPage from '../features/admin/settings/pages/SettingsPage';
import AdminProfilePage from '../features/admin/settings/pages/AdminProfilePage';
import ResidentLayout from '../features/resident/components/ResidentLayout';
import ResidentDashboard from '../features/resident/pages/ResidentDashboard';
import MyPaymentsPage from '../features/resident/pages/MyPaymentsPage';
import SocietyFinancesPage from '../features/resident/pages/SocietyFinancesPage';
import ResidentReportsPage from '../features/resident/pages/ResidentReportsPage';
import MyProfilePage from '../features/resident/pages/MyProfilePage';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<AuthPage />} />

      <Route element={<RequireRole role="admin" />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="income" element={<IncomePage />} />
          <Route path="expenses" element={<ExpensePage />} />
          <Route path="residents" element={<ResidentsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="audit" element={<AuditLogsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
        </Route>
      </Route>

      <Route element={<RequireRole role="resident" />}>
        <Route path="/resident" element={<ResidentLayout />}>
          <Route index element={<ResidentDashboard />} />
          <Route path="payments" element={<MyPaymentsPage />} />
          <Route path="finances" element={<SocietyFinancesPage />} />
          <Route path="reports" element={<ResidentReportsPage />} />
          <Route path="profile" element={<MyProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
