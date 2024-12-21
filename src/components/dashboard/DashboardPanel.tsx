import React, { useEffect, useState } from 'react';
import { Users, Building2, AlertTriangle, DollarSign } from 'lucide-react';
import { storageService } from '../../services/storage';
import { DashboardAlerts } from './DashboardAlerts';
import { differenceInDays } from 'date-fns';
import type { Worker, Organization } from '../../types';

export function DashboardPanel() {
  const [stats, setStats] = useState({
    totalWorkers: 0,
    activeOrganizations: 0,
    expiringDocuments: 0,
    pendingPayments: 0
  });

  const [alerts, setAlerts] = useState({
    workers: [] as Worker[],
    organizations: [] as Organization[]
  });

  useEffect(() => {
    const loadDashboardData = () => {
      const { data: workers } = storageService.loadWorkers();
      const { data: organizations } = storageService.loadOrganizations();
      const today = new Date();

      // Calculate stats
      const expiringWorkers = workers.filter(worker => {
        const daysToExpiry = differenceInDays(new Date(worker.iqamaExpiryDate), today);
        return daysToExpiry >= 0 && daysToExpiry <= 30;
      });

      const workersWithPendingPayments = workers.filter(worker => {
        const monthDiff = differenceInDays(today, new Date(worker.kafalatStartDate)) / 30;
        const requiredMonths = Math.floor(monthDiff) + 1;
        return worker.kafalatPayments.length < requiredMonths;
      });

      const activeOrgs = organizations.filter(org => 
        differenceInDays(new Date(org.expiryDate), today) > 0
      );

      setStats({
        totalWorkers: workers.length,
        activeOrganizations: activeOrgs.length,
        expiringDocuments: expiringWorkers.length,
        pendingPayments: workersWithPendingPayments.length
      });

      setAlerts({
        workers: [...expiringWorkers, ...workersWithPendingPayments],
        organizations: organizations.filter(org => {
          const daysToExpiry = differenceInDays(new Date(org.expiryDate), today);
          return daysToExpiry >= 0 && daysToExpiry <= 30;
        })
      });
    };

    loadDashboardData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Workers</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalWorkers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Organizations</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeOrganizations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Expiring Documents</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.expiringDocuments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending Payments</h3>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingPayments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Alerts & Notifications</h2>
        <DashboardAlerts workers={alerts.workers} organizations={alerts.organizations} />
      </div>
    </div>
  );
} 