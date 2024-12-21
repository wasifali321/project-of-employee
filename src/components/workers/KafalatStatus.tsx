import React from 'react';
import { useTranslation } from 'react-i18next';
import { differenceInMonths, startOfMonth, format } from 'date-fns';
import type { Worker } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface KafalatStatusProps {
  worker: Worker;
  onClick?: () => void;
}

export function KafalatStatus({ worker, onClick }: KafalatStatusProps) {
  const { t } = useTranslation();
  const currentDate = startOfMonth(new Date());
  const startDate = startOfMonth(new Date(worker.dateOfEntry));
  const totalMonths = differenceInMonths(currentDate, startDate) + 1;
  const paidMonths = worker.kafalatPayments.length;
  const unpaidMonths = Math.max(0, totalMonths - paidMonths);
  const pendingAmount = unpaidMonths * worker.kafalatAmount;
  const lastPayment = worker.kafalatPayments[worker.kafalatPayments.length - 1];

  if (unpaidMonths <= 0) {
    return (
      <div className="flex flex-col">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {t('kafalat.status.paid')}
        </span>
        {lastPayment && (
          <span className="text-xs text-gray-500 mt-1">
            Last paid: {format(new Date(lastPayment.date), 'MMM yyyy')}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        unpaidMonths >= 3 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {unpaidMonths} {t('common.monthsPending')}
      </span>
      <span className="text-xs text-gray-500 mt-1">
        ({formatCurrency(pendingAmount)})
      </span>
      {lastPayment && (
        <span className="text-xs text-gray-500 mt-1">
          Last paid: {format(new Date(lastPayment.date), 'MMM yyyy')}
        </span>
      )}
    </div>
  );
}