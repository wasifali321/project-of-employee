import { useTranslation } from 'react-i18next';
import { Calendar, DollarSign } from 'lucide-react';
import type { Worker, Organization } from '../../types/index';
import { differenceInDays, differenceInMonths } from 'date-fns';
import { formatCurrency } from '../../utils/formatters';

interface DashboardAlertsProps {
  workers: Worker[];
  organizations: Organization[];
}

export function DashboardAlerts({ workers = [], organizations = [] }: DashboardAlertsProps) {
  const { t } = useTranslation();
  const currentDate = new Date();

  // Get expiring documents (iqama and organization licenses)
  const expiringDocuments = [
    ...workers
      .filter(worker => worker.iqamaExpiryDate)
      .map(worker => ({
        type: 'iqama',
        name: worker.name,
        expiryDate: worker.iqamaExpiryDate ? new Date(worker.iqamaExpiryDate) : null,
        daysLeft: worker.iqamaExpiryDate ? differenceInDays(new Date(worker.iqamaExpiryDate), currentDate) : 0
      })),
    ...organizations
      .filter(org => org.expiryDate)
      .map(org => ({
        type: 'license',
        name: org.name,
        expiryDate: new Date(org.expiryDate),
        daysLeft: differenceInDays(new Date(org.expiryDate), currentDate)
      }))
  ]
    .filter(doc => doc.daysLeft >= 0 && doc.daysLeft <= 30)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  // Get workers with overdue kafalat payments (3 or more months)
  const overdueKafalat = workers.filter(worker => {
    if (!worker.dateOfEntry) return false;
    const startDate = new Date(worker.dateOfEntry);
    const totalMonths = differenceInMonths(currentDate, startDate) + 1;
    const paidMonths = worker.kafalatPayments?.length || 0;
    return (totalMonths - paidMonths) >= 3;
  });

  if (expiringDocuments.length === 0 && overdueKafalat.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {expiringDocuments.length > 0 && (
        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Calendar className="h-6 w-6 text-yellow-600" />
            <h3 className="ml-2 text-lg font-medium text-yellow-800">
              {t('dashboard.expiringDocuments')}
            </h3>
          </div>
          <div className="space-y-3">
            {expiringDocuments.map((doc, index) => (
              <div
                key={`${doc.type}-${index}`}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {doc.name} ({t(`dashboard.${doc.type}`)})
                  </p>
                  <p className="text-sm text-gray-500">
                    {t('dashboard.expiresOn', {
                      date: doc.expiryDate?.toLocaleDateString() || t('common.unknown')
                    })}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    doc.daysLeft <= 7
                      ? 'bg-red-100 text-red-800'
                      : doc.daysLeft <= 15
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {doc.daysLeft} {t('dashboard.daysLeft')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {overdueKafalat.length > 0 && (
        <div className="bg-red-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <DollarSign className="h-6 w-6 text-red-600" />
            <h3 className="ml-2 text-lg font-medium text-red-800">
              {t('dashboard.overdueKafalat')}
            </h3>
          </div>
          <div className="space-y-3">
            {overdueKafalat.map((worker) => {
              const startDate = new Date(worker.dateOfEntry);
              const totalMonths = differenceInMonths(currentDate, startDate) + 1;
              const paidMonths = worker.kafalatPayments?.length || 0;
              const unpaidMonths = totalMonths - paidMonths;
              const monthlyAmount = worker.kafalatAmount || 0;

              return (
                <div
                  key={worker.id}
                  className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
                >
                  <div>
                    <p className="font-medium text-gray-900">{worker.name}</p>
                    <p className="text-sm text-gray-500">
                      {t('dashboard.unpaidMonths', { count: unpaidMonths })}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    {formatCurrency(unpaidMonths * monthlyAmount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}