import React from 'react';
import { useTranslation } from 'react-i18next';
import { format, differenceInMonths, eachMonthOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { DollarSign, Calendar, AlertCircle } from 'lucide-react';
import type { Worker, KafalatPayment } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface KafalatDetailsProps {
  worker: Worker;
  onUpdatePayments: (payments: KafalatPayment[]) => void;
}

export function KafalatDetails({ worker, onUpdatePayments }: KafalatDetailsProps) {
  const { t } = useTranslation();
  const startDate = startOfMonth(new Date(worker.dateOfEntry));
  const currentDate = startOfMonth(new Date());
  
  // Generate all months from start date to current date
  const months = eachMonthOfInterval({
    start: startDate,
    end: currentDate
  });

  const paidMonths = new Set(worker.kafalatPayments.map(p => p.month));
  
  const handleMonthToggle = (monthKey: string) => {
    let newPayments = [...worker.kafalatPayments];
    
    if (paidMonths.has(monthKey)) {
      // Remove payment
      newPayments = newPayments.filter(p => p.month !== monthKey);
    } else {
      // Add payment
      newPayments.push({
        month: monthKey,
        paid: true,
        amount: worker.kafalatAmount,
        date: new Date().toISOString()
      });
    }
    
    onUpdatePayments(newPayments);
  };

  const handleSelectAll = () => {
    const allMonthKeys = months.map(date => format(date, 'yyyy-MM'));
    const newPayments = allMonthKeys.map(month => ({
      month,
      paid: true,
      amount: worker.kafalatAmount,
      date: new Date().toISOString()
    }));
    onUpdatePayments(newPayments);
  };

  const handleClearAll = () => {
    onUpdatePayments([]);
  };

  const totalMonths = months.length;
  const paidMonthsCount = worker.kafalatPayments.length;
  const unpaidMonths = totalMonths - paidMonthsCount;
  const totalAmount = totalMonths * worker.kafalatAmount;
  const paidAmount = paidMonthsCount * worker.kafalatAmount;
  const pendingAmount = totalAmount - paidAmount;

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-sm font-medium">{t('kafalat.totalMonths')}</span>
            </div>
            <span className="text-lg font-semibold">{totalMonths}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm font-medium">{t('kafalat.paidAmount')}</span>
            </div>
            <span className="text-lg font-semibold text-green-600">
              {formatCurrency(paidAmount)}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-sm font-medium">{t('kafalat.pendingAmount')}</span>
            </div>
            <span className="text-lg font-semibold text-red-600">
              {formatCurrency(pendingAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Month Selection Grid */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-700">{t('kafalat.selectMonths')}</h3>
          <div className="space-x-2">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {t('common.selectAll')}
            </button>
            <button
              onClick={handleClearAll}
              className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-700"
            >
              {t('common.clearAll')}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {months.map(date => {
            const monthKey = format(date, 'yyyy-MM');
            const isPaid = paidMonths.has(monthKey);
            
            return (
              <button
                key={monthKey}
                onClick={() => handleMonthToggle(monthKey)}
                className={`
                  p-2 rounded text-sm font-medium transition-colors
                  ${isPaid 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}
                `}
              >
                {format(date, 'MMM yyyy')}
              </button>
            );
          })}
        </div>
      </div>

      {unpaidMonths > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                {t('kafalat.pendingPayments')}
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                {t('kafalat.pendingMonthsMessage', { count: unpaidMonths })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}