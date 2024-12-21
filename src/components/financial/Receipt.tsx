import { useTranslation } from 'react-i18next';
import type { Worker } from '../../types/index';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/formatters';

interface ReceiptProps {
  data: {
    receiptNumber: string;
    date: string;
    name: string;
    worker: Worker;
    incomeType: string;
    amount: number;
    governmentFee?: number;
  };
  onPrint: () => void;
  onDownload: () => void;
}

export function Receipt({ data, onPrint, onDownload }: ReceiptProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-8 shadow-lg max-w-2xl mx-auto" id="receipt">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">{t('company.name')}</h2>
        <p className="text-gray-500">{t('company.address')}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <p className="text-gray-500">{t('financial.receiptNumber')}</p>
          <p className="font-medium">{data.receiptNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500">{t('financial.date')}</p>
          <p className="font-medium">{format(new Date(data.date), 'PP')}</p>
        </div>
      </div>

      <div className="border-t border-b border-gray-200 py-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">{t('financial.receivedFrom')}</p>
            <p className="font-medium">{data.name}</p>
          </div>
          <div>
            <p className="text-gray-500">{t('workers.workerId')}</p>
            <p className="font-medium">{data.worker.workerId}</p>
          </div>
        </div>
      </div>

      <table className="w-full mb-8">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2">{t('financial.description')}</th>
            <th className="text-right py-2">{t('financial.amount')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2">{t(`financial.${data.incomeType}`)}</td>
            <td className="text-right">{formatCurrency(data.amount)}</td>
          </tr>
          {data.governmentFee && (
            <tr>
              <td className="py-2">{t('financial.governmentFee')}</td>
              <td className="text-right">{formatCurrency(data.governmentFee)}</td>
            </tr>
          )}
          <tr className="border-t border-gray-200 font-medium">
            <td className="py-2">{t('financial.total')}</td>
            <td className="text-right">
              {formatCurrency(data.amount + (data.governmentFee || 0))}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onPrint}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          {t('common.print')}
        </button>
        <button
          onClick={onDownload}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {t('common.download')}
        </button>
      </div>
    </div>
  );
} 