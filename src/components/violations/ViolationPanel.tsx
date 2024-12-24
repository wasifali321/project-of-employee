import { useState, useEffect } from 'react';
import { AlertTriangle, Calendar, DollarSign, Filter, Search, X } from 'lucide-react';
import { storageService } from '../../services/storage';
import { differenceInDays, differenceInMonths, format } from 'date-fns';
import type { Worker } from '../../types';
import { useTranslation } from 'react-i18next';

type ViolationType = 'iqama' | 'kafalat' | 'all';
type MonthRange = '1' | '2' | '3' | '6' | '12' | 'all';

export function ViolationPanel() {
  const { t } = useTranslation();
  const [violations, setViolations] = useState<{
    iqama: Worker[];
    kafalat: Worker[];
  }>({ iqama: [], kafalat: [] });
  
  const [filters, setFilters] = useState({
    type: 'all' as ViolationType,
    monthRange: 'all' as MonthRange,
    searchTerm: ''
  });

  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  useEffect(() => {
    loadViolations();
  }, []);

  const loadViolations = () => {
    const { data: workers } = storageService.loadWorkers();
    
    // Add this debug log to see full worker object structure
    console.log('Full worker objects:', workers.slice(0, 3));

    // Also log all possible field names that might contain expiry date
    console.log('First worker fields:', Object.keys(workers[0]));

    // Update debug logs to show correct field names
    console.log('Total workers:', workers.length);
    console.log('Workers with Iqama dates:', workers.filter(w => w.iqamaExpiryDate).length);
    console.log('Sample of workers:', workers.slice(0, 3).map(w => ({
      name: w.name,
      dateOfIssue: w.dateOfIssue,
      iqamaExpiryDate: w.iqamaExpiryDate,
      workerId: w.workerId
    })));

    const today = new Date();

    // Update Iqama violations check
    const iqamaViolations = workers.filter(worker => {
      if (!worker.iqamaExpiryDate) return false;
      
      try {
        const expiryDate = new Date(worker.iqamaExpiryDate);
        if (isNaN(expiryDate.getTime())) return false;
        
        const daysToExpiry = differenceInDays(expiryDate, today);
        
        // Debug each worker's expiry status
        console.log(`Worker: ${worker.name}, ID: ${worker.workerId}, Expiry: ${worker.iqamaExpiryDate}, Days to expiry: ${daysToExpiry}`);
        
        return daysToExpiry <= 30; // This will include both expired and about-to-expire
      } catch (error) {
        console.error(`Error processing worker ${worker.name}:`, error);
        return false;
      }
    });

    // Update the sorting to use iqamaExpiryDate
    iqamaViolations.sort((a, b) => {
      const daysA = differenceInDays(new Date(a.iqamaExpiryDate), today);
      const daysB = differenceInDays(new Date(b.iqamaExpiryDate), today);
      return daysA - daysB;
    });

    // Find Kafalat violations
    const kafalatViolations = workers.filter(worker => {
      if (!worker.kafalatStartDate) return false;
      
      try {
        const startDate = new Date(worker.kafalatStartDate);
        if (isNaN(startDate.getTime())) return false;
        
        const monthsSinceStart = differenceInMonths(today, startDate);
        const paidMonths = worker.kafalatPayments?.length || 0;
        return monthsSinceStart - paidMonths > 0;
      } catch (error) {
        console.error(`Error processing kafalat for worker ${worker.name}:`, error);
        return false;
      }
    });

    console.log('Iqama Violations found:', iqamaViolations.length);
    console.log('Kafalat Violations found:', kafalatViolations.length);
    
    // Update the violations details log
    console.log('Iqama Violations details:', iqamaViolations.map(w => ({
      name: w.name,
      iqamaNumber: w.iqamaNumber,
      expiryDate: w.expiryDate,
      daysToExpiry: differenceInDays(new Date(w.expiryDate), today)
    })));

    setViolations({
      iqama: iqamaViolations,
      kafalat: kafalatViolations
    });
  };

  const getFilteredViolations = () => {
    let filtered = {
      iqama: [...violations.iqama],
      kafalat: [...violations.kafalat]
    };

    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered.iqama = filtered.iqama.filter(w => 
        w.name.toLowerCase().includes(searchLower) ||
        w.workerId?.toLowerCase().includes(searchLower) ||
        w.iqamaNumber?.toLowerCase().includes(searchLower)
      );
      filtered.kafalat = filtered.kafalat.filter(w => 
        w.name.toLowerCase().includes(searchLower) ||
        w.workerId?.toLowerCase().includes(searchLower)
      );
    }

    // Apply month range filter for kafalat violations
    if (filters.monthRange !== 'all') {
      const monthsOverdue = parseInt(filters.monthRange);
      const today = new Date();
      filtered.kafalat = filtered.kafalat.filter(worker => {
        const monthsSinceStart = differenceInMonths(today, new Date(worker.kafalatStartDate));
        const paidMonths = worker.kafalatPayments?.length || 0;
        const unpaidMonths = monthsSinceStart - paidMonths;
        return unpaidMonths >= monthsOverdue;
      });
    }

    return filtered;
  };

  const filteredViolations = getFilteredViolations();

  const handleWorkerClick = (worker: Worker) => {
    setSelectedWorker(worker);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return format(date, 'dd/MM/yyyy');
    } catch {
      return 'N/A';
    }
  };

  const getViolationStatus = (daysRemaining: number) => {
    if (daysRemaining < 0) {
      return {
        label: 'Expired',
        className: 'bg-red-100 text-red-800'
      };
    } else if (daysRemaining <= 10) {
      return {
        label: '⚠️ Alert - Expires in 10 days',
        className: 'bg-yellow-100 text-yellow-800'
      };
    } else if (daysRemaining <= 30) {
      return {
        label: 'Warning - Expires Soon',
        className: 'bg-blue-100 text-blue-800'
      };
    } else {
      return {
        label: 'Valid',
        className: 'bg-green-100 text-green-800'
      };
    }
  };

  const renderViolationList = (workers: Worker[], type: 'iqama' | 'kafalat') => {
    if (workers.length === 0) {
      return (
        <p className="text-gray-500 text-center py-4">{t('violations.noViolations')}</p>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Worker ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              {type === 'iqama' && (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Iqama Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {type === 'iqama' ? 'Days Remaining' : 'Months Overdue'}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {workers.map(worker => {
              const today = new Date();
              const daysOrMonths = type === 'iqama'
                ? differenceInDays(new Date(worker.iqamaExpiryDate), today)
                : differenceInMonths(today, new Date(worker.kafalatStartDate)) - (worker.kafalatPayments?.length || 0);

              const status = type === 'iqama' ? getViolationStatus(daysOrMonths) : null;

              return (
                <tr 
                  key={worker.id}
                  onClick={() => handleWorkerClick(worker)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {worker.workerId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {worker.name}
                  </td>
                  {type === 'iqama' && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {worker.iqamaNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status?.className}`}>
                          {status?.label}
                        </span>
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {type === 'iqama' 
                      ? `${Math.abs(daysOrMonths)} days ${daysOrMonths < 0 ? 'overdue' : 'remaining'}`
                      : `${daysOrMonths} months overdue`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderWorkerModal = () => {
    if (!selectedWorker) return null;

    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Worker Details
              </h2>
              <button
                onClick={() => setSelectedWorker(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <dl className="grid grid-cols-1 gap-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Worker ID</dt>
                    <dd className="text-sm text-gray-900">{selectedWorker.workerId || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="text-sm text-gray-900">{selectedWorker.name || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nationality</dt>
                    <dd className="text-sm text-gray-900">{selectedWorker.nationality || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Organization</dt>
                    <dd className="text-sm text-gray-900">{selectedWorker.organization || 'N/A'}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Document Information</h3>
                <dl className="grid grid-cols-1 gap-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Iqama Number</dt>
                    <dd className="text-sm text-gray-900">{selectedWorker.iqamaNumber || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Iqama Expiry</dt>
                    <dd className="text-sm text-gray-900">
                      {formatDate(selectedWorker.iqamaExpiryDate)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Passport Number</dt>
                    <dd className="text-sm text-gray-900">{selectedWorker.passportNumber || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Passport Expiry</dt>
                    <dd className="text-sm text-gray-900">
                      {formatDate(selectedWorker.passportExpiry)}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Kafalat Information</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                    <dd className="text-sm text-gray-900">
                      {formatDate(selectedWorker.kafalatStartDate)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Monthly Amount</dt>
                    <dd className="text-sm text-gray-900">
                      {selectedWorker.kafalatAmount 
                        ? `SAR ${selectedWorker.kafalatAmount}`
                        : 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Payments Made</dt>
                    <dd className="text-sm text-gray-900">
                      {selectedWorker.kafalatPayments?.length || 0} months
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="text-sm text-gray-900">
                      {getKafalatStatus(selectedWorker)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getKafalatStatus = (worker: Worker) => {
    if (!worker.kafalatStartDate) return 'Not Started';
    const today = new Date();
    const monthsSinceStart = differenceInMonths(today, new Date(worker.kafalatStartDate));
    const paidMonths = worker.kafalatPayments?.length || 0;
    const unpaidMonths = monthsSinceStart - paidMonths;
    
    if (unpaidMonths <= 0) return 'Up to Date';
    if (unpaidMonths === 1) return '1 Month Overdue';
    return `${unpaidMonths} Months Overdue`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('violations.title')}</h1>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border rounded-md"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="w-48">
            <select
              value={filters.monthRange}
              onChange={(e) => setFilters(prev => ({ ...prev, monthRange: e.target.value as MonthRange }))}
              className="w-full border rounded-md p-2"
            >
              <option value="all">All Overdue</option>
              <option value="1">1+ Month</option>
              <option value="2">2+ Months</option>
              <option value="3">3+ Months</option>
              <option value="6">6+ Months</option>
              <option value="12">12+ Months</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="font-medium text-red-800">{t('violations.iqamaViolations')}</h3>
          </div>
          <p className="mt-1 text-2xl font-bold text-red-900">{filteredViolations.iqama.length}</p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-yellow-500" />
            <h3 className="font-medium text-yellow-800">{t('violations.kafalatViolations')}</h3>
          </div>
          <p className="mt-1 text-2xl font-bold text-yellow-900">{filteredViolations.kafalat.length}</p>
        </div>
      </div>

      {/* Violation Lists */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">{t('violations.iqamaViolations')}</h2>
          {renderViolationList(filteredViolations.iqama, 'iqama')}
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">{t('violations.kafalatViolations')}</h2>
          {renderViolationList(filteredViolations.kafalat, 'kafalat')}
        </div>
      </div>

      {selectedWorker && renderWorkerModal()}
    </div>
  );
} 