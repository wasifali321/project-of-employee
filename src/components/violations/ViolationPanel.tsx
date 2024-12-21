import { useState, useEffect } from 'react';
import { AlertTriangle, Calendar, DollarSign, Filter } from 'lucide-react';
import { storageService } from '../../services/storage';
import { differenceInDays, differenceInMonths, format } from 'date-fns';
import type { Worker } from '../../types/index';

type ViolationType = 'iqama' | 'kafalat' | 'all';
type DateRange = 'all' | '30days' | '60days' | '90days' | 'custom';

export function ViolationPanel() {
  const [violations, setViolations] = useState<{
    iqama: Worker[];
    kafalat: Worker[];
  }>({ iqama: [], kafalat: [] });
  
  const [filters, setFilters] = useState({
    type: 'all' as ViolationType,
    dateRange: 'all' as DateRange,
    customStartDate: '',
    customEndDate: '',
    organization: ''
  });

  const { data: organizations } = storageService.loadOrganizations();

  useEffect(() => {
    const { data: workers } = storageService.loadWorkers();
    const today = new Date();

    // Find Iqama violations
    const iqamaViolations = workers.filter(worker => {
      const daysToExpiry = differenceInDays(new Date(worker.iqamaExpiryDate), today);
      return daysToExpiry <= 30;
    });

    // Find Kafalat violations
    const kafalatViolations = workers.filter(worker => {
      const monthsSinceStart = differenceInMonths(today, new Date(worker.kafalatStartDate));
      const requiredPayments = monthsSinceStart + 1;
      return worker.kafalatPayments.length < requiredPayments;
    });

    setViolations({
      iqama: iqamaViolations,
      kafalat: kafalatViolations
    });
  }, []);

  const getFilteredViolations = () => {
    let filtered = {
      iqama: [...violations.iqama],
      kafalat: [...violations.kafalat]
    };

    // Filter by organization
    if (filters.organization) {
      filtered.iqama = filtered.iqama.filter(w => w.organization === filters.organization);
      filtered.kafalat = filtered.kafalat.filter(w => w.organization === filters.organization);
    }

    // Filter by date range
    const today = new Date();
    let startDate = new Date(0);
    
    switch (filters.dateRange) {
      case '30days':
        startDate = new Date(today.setDate(today.getDate() - 30));
        break;
      case '60days':
        startDate = new Date(today.setDate(today.getDate() - 60));
        break;
      case '90days':
        startDate = new Date(today.setDate(today.getDate() - 90));
        break;
      case 'custom':
        if (filters.customStartDate) {
          startDate = new Date(filters.customStartDate);
        }
        break;
    }

    const endDate = filters.customEndDate ? new Date(filters.customEndDate) : new Date();

    filtered.iqama = filtered.iqama.filter(w => {
      const expiryDate = new Date(w.iqamaExpiryDate);
      return expiryDate >= startDate && expiryDate <= endDate;
    });

    filtered.kafalat = filtered.kafalat.filter(w => {
      const lastPaymentDate = w.kafalatPayments.length > 0 
        ? new Date(w.kafalatPayments[w.kafalatPayments.length - 1].date)
        : new Date(w.kafalatStartDate);
      return lastPaymentDate >= startDate && lastPaymentDate <= endDate;
    });

    return filtered;
  };

  const filteredViolations = getFilteredViolations();

  const renderViolationList = (violations: Worker[], type: 'iqama' | 'kafalat') => {
    return (
      <div className="space-y-4">
        {violations.map(worker => (
          <div key={`${type}-${worker.id}`} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{worker.name}</h3>
                <p className="text-sm text-gray-500">{worker.organization}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                type === 'iqama' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {type === 'iqama' ? 'Iqama Expiring' : 'Kafalat Pending'}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Worker ID:</span>
                <span className="ml-2 text-gray-900">{worker.workerId}</span>
              </div>
              {type === 'iqama' ? (
                <div>
                  <span className="text-gray-500">Expiry Date:</span>
                  <span className="ml-2 text-gray-900">
                    {format(new Date(worker.iqamaExpiryDate), 'PP')}
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-gray-500">Pending Months:</span>
                  <span className="ml-2 text-gray-900">
                    {differenceInMonths(new Date(), new Date(worker.kafalatStartDate)) + 1 - worker.kafalatPayments.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <label className="block text-sm font-medium text-gray-700">Violation Type</label>
            <select
              value={filters.type}
              onChange={e => setFilters(prev => ({ ...prev, type: e.target.value as ViolationType }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Violations</option>
              <option value="iqama">Iqama Only</option>
              <option value="kafalat">Kafalat Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={e => setFilters(prev => ({ ...prev, dateRange: e.target.value as DateRange }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="30days">Last 30 Days</option>
              <option value="60days">Last 60 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {filters.dateRange === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={filters.customStartDate}
                  onChange={e => setFilters(prev => ({ ...prev, customStartDate: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  value={filters.customEndDate}
                  onChange={e => setFilters(prev => ({ ...prev, customEndDate: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Organization</label>
            <select
              value={filters.organization}
              onChange={e => setFilters(prev => ({ ...prev, organization: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Organizations</option>
              {organizations.map(org => (
                <option key={org.id} value={org.name}>{org.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="font-medium text-red-800">Iqama Violations</h3>
          </div>
          <p className="mt-1 text-2xl font-bold text-red-900">{filteredViolations.iqama.length}</p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-yellow-500" />
            <h3 className="font-medium text-yellow-800">Kafalat Violations</h3>
          </div>
          <p className="mt-1 text-2xl font-bold text-yellow-900">{filteredViolations.kafalat.length}</p>
        </div>
      </div>

      {/* Violation Lists */}
      <div className="space-y-6">
        {(filters.type === 'all' || filters.type === 'iqama') && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Iqama Violations</h2>
            {renderViolationList(filteredViolations.iqama, 'iqama')}
          </div>
        )}

        {(filters.type === 'all' || filters.type === 'kafalat') && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Kafalat Violations</h2>
            {renderViolationList(filteredViolations.kafalat, 'kafalat')}
          </div>
        )}
      </div>
    </div>
  );
} 