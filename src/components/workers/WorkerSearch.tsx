import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Calendar, DollarSign } from 'lucide-react';
import type { Worker } from '../../types';
import { differenceInDays, differenceInMonths, subMonths } from 'date-fns';

interface WorkerSearchProps {
  workers: Worker[];
  onFilteredWorkersChange: (workers: Worker[]) => void;
}

export function WorkerSearch({ workers, onFilteredWorkersChange }: WorkerSearchProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    nationality: '',
    iqamaStatus: 'all', // all, expired, expiringSoon (10 days), valid
    kafalatStatus: 'all', // all, pending3Months, upToDate
  });

  // Get unique nationalities from workers
  const nationalities = [...new Set(workers.map(w => w.nationality).filter(Boolean))];

  const applyFilters = () => {
    const currentDate = new Date();
    
    return workers.filter(worker => {
      // Search term filter
      const searchMatch = 
        worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.workerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.nationality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.organization.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!searchMatch) return false;

      // Nationality filter
      if (filters.nationality && worker.nationality !== filters.nationality) {
        return false;
      }

      // Iqama status filter
      if (filters.iqamaStatus !== 'all' && worker.iqamaExpiryDate) {
        const daysToExpiry = differenceInDays(new Date(worker.iqamaExpiryDate), currentDate);
        
        switch (filters.iqamaStatus) {
          case 'expired':
            if (daysToExpiry >= 0) return false;
            break;
          case 'expiringSoon':
            if (daysToExpiry < 0 || daysToExpiry > 10) return false;
            break;
          case 'valid':
            if (daysToExpiry < 0) return false;
            break;
        }
      }

      // Kafalat status filter
      if (filters.kafalatStatus !== 'all') {
        const startDate = new Date(worker.dateOfEntry);
        const totalMonths = differenceInMonths(currentDate, startDate) + 1;
        const paidMonths = worker.kafalatPayments?.length || 0;
        const unpaidMonths = totalMonths - paidMonths;

        switch (filters.kafalatStatus) {
          case 'pending3Months':
            if (unpaidMonths < 3) return false;
            break;
          case 'upToDate':
            if (unpaidMonths > 0) return false;
            break;
        }
      }

      return true;
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onFilteredWorkersChange(applyFilters());
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    onFilteredWorkersChange(applyFilters());
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={t('workers.searchPlaceholder')}
            className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
            showFilters 
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="h-5 w-5" />
          {t('workers.filters')}
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('workers.nationality')}
            </label>
            <select
              value={filters.nationality}
              onChange={(e) => handleFilterChange('nationality', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">{t('workers.allNationalities')}</option>
              {nationalities.map(nationality => (
                <option key={nationality} value={nationality}>
                  {nationality}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {t('workers.iqamaStatus')}
              </div>
            </label>
            <select
              value={filters.iqamaStatus}
              onChange={(e) => handleFilterChange('iqamaStatus', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">{t('workers.allStatuses')}</option>
              <option value="expired">{t('workers.expired')}</option>
              <option value="expiringSoon">{t('workers.expiringSoon')}</option>
              <option value="valid">{t('workers.valid')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {t('workers.kafalatStatus')}
              </div>
            </label>
            <select
              value={filters.kafalatStatus}
              onChange={(e) => handleFilterChange('kafalatStatus', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">{t('workers.allStatuses')}</option>
              <option value="pending3Months">{t('workers.pending3Months')}</option>
              <option value="upToDate">{t('workers.upToDate')}</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}