import { useTranslation } from 'react-i18next';
import type { VisaService } from '../../types/index';

interface VisaServiceListProps {
  services: VisaService[];
}

export function VisaServiceList({ services }: VisaServiceListProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('visa.customerName')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('visa.passportNumber')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('visa.organization')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('visa.status')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {services.map((service) => (
            <tr key={service.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {service.customerName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {service.passportNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {service.organization}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {service.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 