import React from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Calendar, AlertCircle } from 'lucide-react';
import { differenceInMonths, format } from 'date-fns';

interface KafalatSummaryProps {
  startDate: Date;
  selectedMonths: string[];
  exemptMonths: string[];
  monthlyAmount: number;
}

export function KafalatSummary({ startDate, selectedMonths, exemptMonths, monthlyAmount }: KafalatSummaryProps) {
  const { t } = useTranslation();
  const currentDate = new Date();
  
  const totalMonths = Math.max(0, differenceInMonths(currentDate, startDate) + 1);
  const totalAmount = totalMonths * monthlyAmount;
  const paidAmount = selectedMonths.length * monthlyAmount;
  const remainingAmount = totalAmount - paidAmount;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-blue-600" />
          <span className="font-medium">{t('workers.kafalatSummary')}</span>
        </div>
        <div className="text-sm font-medium text-blue-600">
          {monthlyAmount.toLocaleString()} SAR / {t('common.month')}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{t('workers.totalMonths')}</span>
          </div>
          <p className="text-lg font-semibold">{totalMonths}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{t('workers.paidMonths')}</span>
          </div>
          <p className="text-lg font-semibold text-green-600">{selectedMonths.length}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <DollarSign className="h-4 w-4" />
            <span>{t('workers.totalAmount')}</span>
          </div>
          <p className="text-lg font-semibold">{totalAmount.toLocaleString()} SAR</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <DollarSign className="h-4 w-4" />
            <span>{t('workers.paidAmount')}</span>
          </div>
          <p className="text-lg font-semibold text-green-600">{paidAmount.toLocaleString()} SAR</p>
        </div>
      </div>

      {remainingAmount > 0 && (
        <div className="flex items-center gap-2 bg-amber-50 text-amber-800 p-3 rounded-lg mt-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-medium">{t('workers.paymentPending')}</p>
            <p className="text-sm">{remainingAmount.toLocaleString()} SAR</p>
          </div>
        </div>
      )}
    </div>
  );
}