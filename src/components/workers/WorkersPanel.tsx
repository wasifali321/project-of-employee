import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WorkerList } from './WorkerList';
import { WorkerForm } from './WorkerForm';
import { BulkWorkerEntry } from './BulkWorkerEntry';
import { WorkerSearch } from './WorkerSearch';
import type { Worker, Organization, FinancialTransaction } from '../../types/index';
import { Users, Upload } from 'lucide-react';
import { FilterBar } from '../shared/FilterBar';

interface WorkersPanelProps {
  workers: Worker[];
  organizations: Organization[];
  onAddWorker: (worker: Omit<Worker, 'id'>) => void;
  onEditWorker: (worker: Worker) => void;
  onDeleteWorker: (workerId: string) => void;
  onAddTransaction?: (transaction: Omit<FinancialTransaction, 'id'>) => void;
}

export function WorkersPanel({
  workers,
  organizations,
  onAddWorker,
  onEditWorker,
  onDeleteWorker,
  onAddTransaction
}: WorkersPanelProps) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [showBulkEntry, setShowBulkEntry] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>(workers);

  const handleEdit = (worker: Worker) => {
    setEditingWorker(worker);
    setShowForm(true);
    setShowBulkEntry(false);
  };

  const handleSubmit = (workerData: Omit<Worker, 'id'>) => {
    if (editingWorker) {
      onEditWorker({ ...workerData, id: editingWorker.id });
    } else {
      onAddWorker(workerData);
    }
    setShowForm(false);
    setEditingWorker(null);
  };

  const handleBulkSubmit = (workers: Omit<Worker, 'id'>[]) => {
    workers.forEach(worker => onAddWorker(worker));
    setShowBulkEntry(false);
  };

  const handleUpdateWorker = (updatedWorker: Worker) => {
    onEditWorker(updatedWorker);
  };

  const workerFilters = [
    {
      key: 'organization',
      label: t('workers.organization'),
      type: 'select' as const,
      options: organizations.map(org => ({
        value: org.name,
        label: org.name
      }))
    },
    {
      key: 'nationality',
      label: t('workers.nationality'),
      type: 'text' as const,
    },
    {
      key: 'iqamaStatus',
      label: t('workers.iqamaStatus'),
      type: 'select' as const,
      options: [
        { value: 'valid', label: t('workers.valid') },
        { value: 'expired', label: t('workers.expired') },
        { value: 'expiringSoon', label: t('workers.expiringSoon') }
      ]
    },
    {
      key: 'kafalatStatus',
      label: t('workers.kafalatStatus'),
      type: 'select' as const,
      options: [
        { value: 'upToDate', label: t('workers.upToDate') },
        { value: 'overdue', label: t('workers.overdue') }
      ]
    }
  ];

  const handleFilterChange = (filters: Record<string, any>) => {
    let filtered = [...workers];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(worker => 
        worker.name.toLowerCase().includes(search) ||
        worker.workerId.toLowerCase().includes(search)
      );
    }

    if (filters.organization) {
      filtered = filtered.filter(worker => worker.organization === filters.organization);
    }

    if (filters.nationality) {
      filtered = filtered.filter(worker => 
        worker.nationality.toLowerCase().includes(filters.nationality.toLowerCase())
      );
    }

    if (filters.iqamaStatus) {
      const today = new Date();
      filtered = filtered.filter(worker => {
        if (!worker.iqamaExpiryDate) return false;
        const expiryDate = new Date(worker.iqamaExpiryDate);
        const daysLeft = differenceInDays(expiryDate, today);
        
        switch (filters.iqamaStatus) {
          case 'valid': return daysLeft > 30;
          case 'expired': return daysLeft < 0;
          case 'expiringSoon': return daysLeft >= 0 && daysLeft <= 30;
          default: return true;
        }
      });
    }

    setFilteredWorkers(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">{t('workers.title')}</h2>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setShowBulkEntry(!showBulkEntry);
              setShowForm(false);
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            {showBulkEntry ? t('common.cancel') : t('workers.bulkEntry')}
          </button>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setShowBulkEntry(false);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {showForm ? t('common.cancel') : t('workers.addWorker')}
          </button>
        </div>
      </div>

      <FilterBar 
        filters={workerFilters}
        onFilterChange={handleFilterChange}
      />

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <WorkerForm
            onSubmit={handleSubmit}
            onAddTransaction={onAddTransaction}
            initialData={editingWorker || undefined}
            organizations={organizations}
          />
        </div>
      )}

      {showBulkEntry && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{t('workers.bulkEntry')}</h3>
          <BulkWorkerEntry
            organizations={organizations}
            onSubmit={handleBulkSubmit}
          />
        </div>
      )}

      <WorkerSearch
        workers={workers}
        onFilteredWorkersChange={setFilteredWorkers}
      />

      <WorkerList
        workers={filteredWorkers}
        onEdit={handleEdit}
        onDelete={onDeleteWorker}
        onUpdateWorker={handleUpdateWorker}
      />
    </div>
  );
}