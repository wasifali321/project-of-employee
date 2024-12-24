import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { Dashboard } from '../components/dashboard/Dashboard';
import { WorkerPanel } from '../components/workers/WorkerPanel';
import { VisaInventoryPanel } from '../components/visa/VisaInventoryPanel';
import { OrganizationPanel } from '../components/organization/OrganizationPanel';
import { FinancialPanel } from '../components/financial/FinancialPanel';
import { SettingsPanel } from '../components/settings/SettingsPanel';
import { ViolationPanel } from '../components/violations/ViolationPanel';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export function AppRoutes() {
  console.log('Rendering AppRoutes'); // Debug log
  
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="workers/*" element={<WorkerPanel />} />
        <Route path="visa-inventory/*" element={<VisaInventoryPanel />} />
        <Route path="organizations/*" element={<OrganizationPanel />} />
        <Route path="financial/*" element={<FinancialPanel />} />
        <Route path="settings" element={<SettingsPanel />} />
        <Route path="violations" element={<ViolationPanel />} />
      </Route>
    </Routes>
  );
} 