import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import { DashboardPanel } from './components/dashboard/DashboardPanel';
import { WorkerList } from './components/workers/WorkerList';
import { WorkerForm } from './components/workers/WorkerForm';
import { OrganizationPanel } from './components/organization/OrganizationPanel';
import { ViolationPanel } from './components/violations/ViolationPanel';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginForm } from './components/auth/LoginForm';
import { storageService } from './services/storage';
import { FinancialPanel } from './components/financial/FinancialPanel';
import { SettingsPanel } from './components/settings/SettingsPanel';

export function AppRoutes() {
  const handleWorkerSubmit = (worker: Worker) => {
    storageService.saveWorker(worker);
    window.location.href = '/workers';
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardPanel />} />
        <Route path="dashboard" element={<DashboardPanel />} />
        <Route path="workers" element={<WorkerList />} />
        <Route path="workers/add" element={
          <WorkerForm 
            onSubmit={handleWorkerSubmit}
            onCancel={() => window.location.href = '/workers'}
          />
        } />
        <Route path="organizations" element={<OrganizationPanel />} />
        <Route path="violations" element={<ViolationPanel />} />
        <Route path="financial" element={<FinancialPanel />} />
        <Route path="settings" element={
          <ProtectedRoute>
            <SettingsPanel />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
} 