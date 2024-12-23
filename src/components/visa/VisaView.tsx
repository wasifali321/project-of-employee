import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Visa } from '../../types';
import { format } from 'date-fns';

interface VisaViewProps {
  visa: Visa;
  onClose: () => void;
}

export function VisaView({ visa, onClose }: VisaViewProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">{t('visa.visaDetails')}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-500"
            title={t('common.close')}
            aria-label={t('common.close')}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">{t('visa.visaNumber')}</p>
              <p className="mt-1">{visa.visaNumber}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">{t('visa.profession')}</p>
              <p className="mt-1">{visa.profession}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">{t('visa.status')}</p>
              <p className="mt-1">{t(`visa.${visa.status}`)}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">{t('visa.type')}</p>
              <p className="mt-1">{t(`visa.${visa.type}`)}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">{t('visa.nationality')}</p>
              <p className="mt-1">{visa.nationality}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">{t('visa.gender')}</p>
              <p className="mt-1">{t(`visa.${visa.gender}`)}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">{t('visa.purchaseDate')}</p>
              <p className="mt-1">{format(new Date(visa.purchaseDate), 'dd/MM/yyyy')}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">{t('visa.expiryDate')}</p>
              <p className="mt-1">{format(new Date(visa.expiryDate), 'dd/MM/yyyy')}</p>
            </div>

            {visa.supplier && (
              <div>
                <p className="text-sm font-medium text-gray-500">{t('visa.supplier')}</p>
                <p className="mt-1">{visa.supplier}</p>
              </div>
            )}

            {visa.notes && (
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">{t('visa.notes')}</p>
                <p className="mt-1">{visa.notes}</p>
              </div>
            )}
          </div>

          {visa.documents && visa.documents.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium">{t('visa.documents')}</h3>
              <div className="mt-2 space-y-2">
                {visa.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {doc.name}
                    </a>
                    <span className="text-sm text-gray-500">
                      {format(new Date(doc.uploadDate), 'dd/MM/yyyy')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 