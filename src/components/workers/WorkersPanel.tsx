import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WorkerList } from './WorkerList';
import { WorkerForm } from './WorkerForm';
import { WorkerSearch } from './WorkerSearch';
import { BulkWorkerEntry } from './BulkWorkerEntry';
import type { Worker, Organization } from '../../types';
import { Plus, Upload } from 'lucide-react';

interface WorkersPanelProps {
  workers: Worker[];
  organizations: Organization[];
  onAddWorker: (worker: Omit<Worker, 'id'>) => void;
  onEditWorker: (worker: Worker) => void;
  onDeleteWorker: (workerId: string) => void;
}

export function WorkersPanel({
  workers,
  organizations,
  onAddWorker,
  onEditWorker,
  onDeleteWorker,
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
    workers.forEach(onAddWorker);
    setShowBulkEntry(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{t('workers.title')}</h2>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowForm(true);
              setShowBulkEntry(false);
              setEditingWorker(null);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            {t('workers.addWorker')}
          </button>
          <button
            onClick={() => {
              setShowBulkEntry(true);
              setShowForm(false);
            }}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            <Upload className="h-5 w-5" />
            {t('workers.bulkUpload')}
          </button>
        </div>
      </div>

      <WorkerSearch onFilteredWorkersChange={setFilteredWorkers} />

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <WorkerForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingWorker(null);
            }}
            initialData={editingWorker || undefined}
            organizations={organizations}
          />
        </div>
      )}

      {showBulkEntry && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <BulkWorkerEntry
            onSubmit={handleBulkSubmit}
            onCancel={() => setShowBulkEntry(false)}
          />
        </div>
      )}

      <WorkerList
        workers={filteredWorkers}
        onEdit={handleEdit}
        onDelete={onDeleteWorker}
      />
    </div>
  );
}