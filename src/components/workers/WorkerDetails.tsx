import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, User, Calendar, Phone, Globe, Building2, FileText } from 'lucide-react';
import type { Worker, KafalatPayment } from '../../types';
import { KafalatDetails } from './KafalatDetails';

interface WorkerDetailsProps {
  worker: Worker;
  onClose: () => void;
  onUpdate: (worker: Worker) => void;
}

export function WorkerDetails({ worker, onClose, onUpdate }: WorkerDetailsProps) {
  const { t } = useTranslation();

  const handleKafalatUpdate = (payments: KafalatPayment[]) => {
    onUpdate({
      ...worker,
      kafalatPayments: payments
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{worker.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">{t('workers.workerId')}</p>
                  <p className="font-medium">{worker.workerId}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">{t('workers.nationality')}</p>
                  <p className="font-medium">{worker.nationality}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">{t('workers.phoneNumber')}</p>
                  <p className="font-medium">{worker.phoneNumber}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">{t('workers.organization')}</p>
                  <p className="font-medium">{worker.organization}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">{t('workers.dateOfEntry')}</p>
                  <p className="font-medium">{new Date(worker.dateOfEntry).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">{t('workers.iqamaExpiryDate')}</p>
                  <p className="font-medium">
                    {worker.iqamaExpiryDate 
                      ? new Date(worker.iqamaExpiryDate).toLocaleDateString() 
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('workers.kafalatPayments')}</h3>
            <KafalatDetails 
              worker={worker}
              onUpdatePayments={handleKafalatUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}