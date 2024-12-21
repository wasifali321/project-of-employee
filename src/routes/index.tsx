import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { LoginForm } from '../components/auth/LoginForm';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { DashboardPanel } from '../components/dashboard/DashboardPanel';
import { FinancialPanel } from '../components/financial/FinancialPanel';
import { WorkerList } from '../components/workers/WorkerList';
import { VisaServicePanel } from '../components/visa/VisaServicePanel';
import { SettingsPanel } from '../components/settings/SettingsPanel';
import { UnauthorizedPage } from '../components/auth/UnauthorizedPage';
import { storageService } from '../services/storage';

export function AppRoutes() {
  const workers = storageService.loadWorkers();
  const services = storageService.loadServices();
  const organizations = storageService.loadOrganizations();

  const handleWorkerUpdate = (worker: Worker) => {
    // Implement worker update logic
  };

  const handleWorkerDelete = (id: string) => {
    // Implement worker delete logic
  };

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
        
        <Route path="financial" element={
          <ProtectedRoute requiredPermission="read.financial">
            <FinancialPanel />
          </ProtectedRoute>
        } />
        
        <Route path="workers" element={
          <ProtectedRoute requiredPermission="read.workers">
            <WorkerList
              workers={workers}
              onEdit={handleWorkerUpdate}
              onDelete={handleWorkerDelete}
              onUpdateWorker={handleWorkerUpdate}
              onSearch={(term, filters) => {/* Implement search */}}
            />
          </ProtectedRoute>
        } />
        
        <Route path="visas" element={
          <ProtectedRoute requiredPermission="read.visas">
            <VisaServicePanel
              services={services}
              organizations={organizations}
            />
          </ProtectedRoute>
        } />
        
        <Route path="settings" element={
          <ProtectedRoute requiredPermission="read.settings">
            <SettingsPanel />
          </ProtectedRoute>
        } />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
} 