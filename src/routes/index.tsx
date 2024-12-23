import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { LoginForm } from '../components/auth/LoginForm';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { DashboardPanel } from '../components/dashboard/DashboardPanel';
import { WorkersPanel } from '../components/workers/WorkersPanel';
import { VisaPanel } from '../components/visa/VisaPanel';
import { FinancialPanel } from '../components/financial/FinancialPanel';
import { SettingsPanel } from '../components/settings/SettingsPanel';
import { UnauthorizedPage } from '../components/auth/UnauthorizedPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPanel />} />
        <Route path="workers" element={<WorkersPanel />} />
        <Route path="visas" element={<VisaPanel />} />
        <Route path="financial" element={<FinancialPanel />} />
        <Route path="settings" element={<SettingsPanel />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
} 