import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { AlertTriangle, Building2, Calendar, X } from 'lucide-react';
import type { Worker, Organization } from '../../types';
import { OrganizationView } from '../organization/OrganizationView';

interface DashboardAlertsProps {
  workers: Worker[];
  organizations: Organization[];
}

export function DashboardAlerts({ workers, organizations }: DashboardAlertsProps) {
  const { t } = useTranslation();
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const expiringIqamas = workers.filter(worker => {
    const daysToExpiry = Math.ceil(
      (new Date(worker.iqamaExpiry).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
    );
    return daysToExpiry <= 30 && daysToExpiry > 0;
  });

  const expiringOrgs = organizations.filter(org => {
    const daysToExpiry = Math.ceil(
      (new Date(org.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
    );
    return daysToExpiry <= 30 && daysToExpiry > 0;
  });

  const handleOrgClick = (org: Organization) => {
    setSelectedOrg(org);
  };

  return (
    <div className="space-y-6">
      {/* Organizations Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t('dashboard.expiringOrganizations')}
        </h3>
        <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
          {expiringOrgs.length === 0 ? (
            <p className="p-4 text-gray-500 text-center">{t('dashboard.noExpiringOrganizations')}</p>
          ) : (
            expiringOrgs.map(org => (
              <div
                key={org.id}
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleOrgClick(org)}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Building2 className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {org.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {t('organizations.crNumber')}: {org.commercialNumber}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {format(new Date(org.expiryDate), 'dd/MM/yyyy')}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {t('dashboard.expiresIn', {
                        days: Math.ceil(
                          (new Date(org.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
                        )
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Workers Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t('dashboard.expiringDocuments')}
        </h3>
        <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
          {expiringIqamas.length === 0 ? (
            <p className="p-4 text-gray-500 text-center">{t('dashboard.noExpiringDocuments')}</p>
          ) : (
            expiringIqamas.map(worker => (
              <div key={worker.id} className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{worker.name}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(worker.iqamaExpiry), 'dd/MM/yyyy')}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {t('dashboard.iqamaExpiresIn', {
                        days: Math.ceil(
                          (new Date(worker.iqamaExpiry).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
                        )
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Organization Details Modal */}
      {selectedOrg && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrg(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
            <OrganizationView organization={selectedOrg} onClose={() => setSelectedOrg(null)} />
          </div>
        </div>
      )}
    </div>
  );
}