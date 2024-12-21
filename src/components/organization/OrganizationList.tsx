import React, { useState } from 'react';
import { Edit2, Trash2, Eye, Users } from 'lucide-react';
import type { Organization } from '../../types';
import { OrganizationView } from './OrganizationView';
import { storageService } from '../../services/storage';

interface OrganizationListProps {
  organizations: Organization[];
  onEdit?: (org: Organization) => void;
  onDelete?: (id: string) => void;
}

export function OrganizationList({ organizations, onEdit, onDelete }: OrganizationListProps) {
  const [viewingOrg, setViewingOrg] = useState<Organization | null>(null);

  // Calculate worker count for each organization
  const getWorkerCount = (orgName: string) => {
    const { data: workers } = storageService.loadWorkers();
    return workers.filter(w => w.organization === orgName).length;
  };

  if (viewingOrg) {
    return <OrganizationView organization={viewingOrg} onClose={() => setViewingOrg(null)} />;
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commercial No.</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Workers</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {organizations.map((org) => (
            <tr key={org.id}>
              <td className="px-6 py-4 whitespace-nowrap">{org.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{org.commercialNumber}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-500 mr-2" />
                  <span>{getWorkerCount(org.name)}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(org.expiryDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewingOrg(org)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(org)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(org.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 