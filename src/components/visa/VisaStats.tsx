import { useTranslation } from 'react-i18next';
import { Briefcase, CheckCircle, Clock, XCircle } from 'lucide-react';
import type { Visa } from '../../types';

interface VisaStatsProps {
  visas: Visa[];
}

export function VisaStats({ visas }: VisaStatsProps) {
  const { t } = useTranslation();

  const stats = {
    total: visas.length,
    available: visas.filter(v => v.status === 'available').length,
    reserved: visas.filter(v => v.status === 'reserved').length,
    used: visas.filter(v => v.status === 'used').length
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{t('visa.totalVisas')}</p>
            <p className="text-2xl font-semibold">{stats.total}</p>
          </div>
          <Briefcase className="h-8 w-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{t('visa.available')}</p>
            <p className="text-2xl font-semibold text-green-600">{stats.available}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{t('visa.reserved')}</p>
            <p className="text-2xl font-semibold text-yellow-600">{stats.reserved}</p>
          </div>
          <Clock className="h-8 w-8 text-yellow-500" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{t('visa.used')}</p>
            <p className="text-2xl font-semibold text-gray-600">{stats.used}</p>
          </div>
          <XCircle className="h-8 w-8 text-gray-500" />
        </div>
      </div>
    </div>
  );
} 