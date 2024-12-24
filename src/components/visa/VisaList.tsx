import { useTranslation } from 'react-i18next';
import type { Visa } from '../../types';

interface VisaListProps {
  visas: Visa[];
  onVisaClick: (visa: Visa) => void;
}

export function VisaList({ visas, onVisaClick }: VisaListProps) {
  const { t } = useTranslation();

  if (visas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t('visa.noVisas')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('visa.visaNumber')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('visa.profession')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('visa.nationality')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('visa.status')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('visa.type')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('visa.price')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {visas.map((visa) => (
            <tr 
              key={visa.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onVisaClick(visa)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {visa.visaNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {visa.profession}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {visa.nationality}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {t(`visa.${visa.status}`)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {t(`visa.${visa.type}`)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {visa.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 