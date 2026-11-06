import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import RequireRole from './RequireRole';
import AuthPage from '../features/auth/pages/AuthPage';
import LoadingState from '../components/ui/LoadingState';

const DashboardLayout = lazy(() => import('../features/admin/dashboard/components/DashboardLayout'));
const DashboardOverview = lazy(() => import('../features/admin/dashboard/pages/DashboardOverview'));
const IncomePage = lazy(() => import('../features/admin/income/pages/IncomePage'));
const ExpensePage = lazy(() => import('../features/admin/expenses/pages/ExpensePage'));
const ResidentsPage = lazy(() => import('../features/admin/residents/pages/ResidentsPage'));
const ReportsPage = lazy(() => import('../features/admin/reports/pages/ReportsPage'));
const AuditLogsPage = lazy(() => import('../features/admin/audit/pages/AuditLogsPage'));
const SettingsPage = lazy(() => import('../features/admin/settings/pages/SettingsPage'));
const AdminProfilePage = lazy(() => import('../features/admin/settings/pages/AdminProfilePage'));
const ResidentLayout = lazy(() => import('../features/resident/components/ResidentLayout'));
const ResidentDashboard = lazy(() => import('../features/resident/pages/ResidentDashboard'));
const MyPaymentsPage = lazy(() => import('../features/resident/pages/MyPaymentsPage'));
const SocietyFinancesPage = lazy(() => import('../features/resident/pages/SocietyFinancesPage'));
const ResidentReportsPage = lazy(() => import('../features/resident/pages/ResidentReportsPage'));
const MyProfilePage = lazy(() => import('../features/resident/pages/MyProfilePage'));

const AppRoutes = () => (
  <BrowserRouter>
    <Suspense fallback={<LoadingState label="Loading page..." className="min-h-screen" />}>
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
    </Suspense>
  </BrowserRouter>
);

export default AppRoutes;
