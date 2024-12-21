import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Organization, Worker } from '../../types';
import { format } from 'date-fns';
import { storageService } from '../../services/storage';

interface OrganizationViewProps {
  organization: Organization;
  onClose: () => void;
}

export function OrganizationView({ organization, onClose }: OrganizationViewProps) {
  const [linkedWorkers, setLinkedWorkers] = useState<Worker[]>([]);

  useEffect(() => {
    const { data: workers } = storageService.loadWorkers();
    const orgWorkers = workers.filter(w => w.organization === organization.name);
    setLinkedWorkers(orgWorkers);
  }, [organization.name]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Organization Details</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Name</label>
              <p className="mt-1 text-sm font-medium text-gray-900">{organization.name}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-700">Commercial Number</label>
              <p className="mt-1 text-sm font-medium text-gray-900">{organization.commercialNumber}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-700">Unified Number</label>
              <p className="mt-1 text-sm font-medium text-gray-900">{organization.unifiedNumber}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4">Additional Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Qiwa Number</label>
              <p className="mt-1 text-sm font-medium text-gray-900">{organization.qiwaNumber}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-700">GOSI Number</label>
              <p className="mt-1 text-sm font-medium text-gray-900">{organization.gosiNumber}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-700">Expiry Date</label>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {format(new Date(organization.expiryDate), 'PP')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-500 mb-4">
          Linked Workers ({linkedWorkers.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Worker ID</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Nationality</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Iqama Expiry</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {linkedWorkers.map((worker) => (
                <tr key={worker.id}>
                  <td className="px-3 py-2 text-sm text-gray-900">{worker.name}</td>
                  <td className="px-3 py-2 text-sm text-gray-500">{worker.workerId}</td>
                  <td className="px-3 py-2 text-sm text-gray-500">{worker.nationality}</td>
                  <td className="px-3 py-2 text-sm text-gray-500">
                    {format(new Date(worker.iqamaExpiryDate), 'PP')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 