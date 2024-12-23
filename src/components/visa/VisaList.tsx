import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit2, Trash2, Eye, UserPlus } from 'lucide-react';
import type { Visa } from '../../types';
import { format } from 'date-fns';
import { storageService } from '../../services/storage';

interface VisaListProps {
  visas: Visa[];
  onEdit: (visa: Visa) => void;
  onDelete: (id: string) => void;
  onAssign: (visa: Visa) => void;
  onView: (visa: Visa) => void;
}

export function VisaList({ visas, onEdit, onDelete, onAssign, onView }: VisaListProps) {
  const { t } = useTranslation();
  const [organizations, setOrganizations] = useState<Record<string, any>>({});

  useEffect(() => {
    const { data } = storageService.loadOrganizations();
    const orgMap = data.reduce((acc: Record<string, any>, org: any) => {
      acc[org.id] = org;
      return acc;
    }, {});
    setOrganizations(orgMap);
  }, []);

  const getStatusColor = (status: Visa['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'used': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('visa.borderNumber')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('visa.visaNumber')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('visa.organization')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('visa.unifiedNumber')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('visa.crNumber')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('visa.status')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('common.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {visas.map((visa) => {
            const organization = organizations[visa.organizationId];
            return (
              <tr key={visa.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {visa.borderNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {visa.visaNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {organization?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {organization?.unifiedNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {organization?.crNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(visa.status)}`}>
                    {t(`visa.${visa.status}`)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => onView(visa)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    {visa.status === 'available' && (
                      <button
                        onClick={() => onAssign(visa)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <UserPlus className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(visa)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(visa.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
} 