import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ChevronLeft, ChevronRight, Edit2, Trash2, Eye } from 'lucide-react';
import { storageService } from '../../services/storage';
import { differenceInDays } from 'date-fns';
import type { Worker } from '../../types';
import { WorkerForm } from './WorkerForm';
import { WorkerView } from './WorkerView';

function IqamaStatus({ expiryDate }: { expiryDate: string }) {
  const daysLeft = differenceInDays(new Date(expiryDate), new Date());
  let statusColor = 'bg-green-100 text-green-800';
  let text = `${daysLeft} days left`;

  if (daysLeft < 0) {
    statusColor = 'bg-red-100 text-red-800';
    text = 'Expired';
  } else if (daysLeft < 30) {
    statusColor = 'bg-yellow-100 text-yellow-800';
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
      {text}
    </span>
  );
}

function KafalatStatus({ payments, startDate }: { payments: Worker['kafalatPayments']; startDate: string }) {
  const start = new Date(startDate);
  const now = new Date();
  const monthDiff = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  const totalMonthsRequired = Math.max(0, monthDiff + 1);
  const paidMonths = payments.length;
  const pendingMonths = totalMonthsRequired - paidMonths;
  const isPending = pendingMonths > 0;
  
  const statusColor = isPending ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
  
  return (
    <div className="flex flex-col gap-1">
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
        {isPending ? 'Pending' : 'Paid'}
      </span>
      {isPending && (
        <span className="text-xs text-gray-500">
          {pendingMonths} month{pendingMonths > 1 ? 's' : ''} pending
        </span>
      )}
    </div>
  );
}

export function WorkerList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [viewingWorker, setViewingWorker] = useState<Worker | null>(null);
  const [workers, setWorkers] = useState<{ data: Worker[]; total: number; pages: number }>({
    data: [],
    total: 0,
    pages: 0
  });

  useEffect(() => {
    const loadData = () => {
      const result = storageService.loadWorkers(currentPage);
      setWorkers(result);
    };
    loadData();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (worker: Worker) => {
    setEditingWorker(worker);
  };

  const handleDelete = (workerId: string) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      storageService.deleteWorker(workerId);
      // Refresh the list
      window.location.reload();
    }
  };

  const handleUpdate = (updatedWorker: Worker) => {
    storageService.updateWorker(updatedWorker);
    setEditingWorker(null);
    // Refresh the list
    window.location.reload();
  };

  const handleView = (worker: Worker) => {
    setViewingWorker(worker);
  };

  if (editingWorker) {
    return (
      <WorkerForm 
        initialData={editingWorker}
        onSubmit={handleUpdate}
        onCancel={() => setEditingWorker(null)}
      />
    );
  }

  if (viewingWorker) {
    return (
      <WorkerView
        worker={viewingWorker}
        onClose={() => setViewingWorker(null)}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Workers</h1>
          <p className="text-sm text-gray-600">Total: {workers.total}</p>
        </div>
        <Link
          to="/workers/add"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add Worker
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Worker ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organization</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Iqama Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kafalat Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {workers.data.map((worker: Worker) => (
              <tr key={worker.id}>
                <td className="px-6 py-4 whitespace-nowrap">{worker.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{worker.workerId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{worker.organization}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <IqamaStatus expiryDate={worker.iqamaExpiryDate} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <KafalatStatus 
                    payments={worker.kafalatPayments} 
                    startDate={worker.kafalatStartDate}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(worker)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(worker)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(worker.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, workers.total)} of {workers.total} entries
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {Array.from({ length: workers.pages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === workers.pages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}