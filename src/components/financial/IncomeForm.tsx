import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Worker } from '../../types/index';
import { Select } from '../shared/Select';
import { format } from 'date-fns';

interface IncomeFormProps {
  workers: Worker[];
  onSubmit: (data: any) => void;
  onGenerateReceipt: (data: any) => void;
}

export function IncomeForm({ workers, onSubmit, onGenerateReceipt }: IncomeFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    workerId: '',
    receiptNumber: `REC-${Date.now()}`,
    incomeType: '',
    amount: '',
    governmentFee: '',
  });
  
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  useEffect(() => {
    if (formData.workerId) {
      const worker = workers.find(w => w.id === formData.workerId);
      setSelectedWorker(worker || null);
    }
  }, [formData.workerId, workers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      worker: selectedWorker,
      date: new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('financial.name')}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('financial.worker')}
          </label>
          <Select
            value={formData.workerId}
            onChange={value => setFormData({ ...formData, workerId: value })}
            options={workers.map(worker => ({
              value: worker.id,
              label: worker.name
            }))}
            className="mt-1"
          />
        </div>

        {selectedWorker && (
          <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">
              {t('workers.currentStatus')}
            </h4>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">{t('workers.kafalatStatus')}</dt>
                <dd className="text-sm text-gray-900">
                  {selectedWorker.kafalatPayments.length > 0
                    ? format(new Date(selectedWorker.kafalatPayments[selectedWorker.kafalatPayments.length - 1].date), 'PP')
                    : t('common.notAvailable')}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">{t('workers.iqamaExpiry')}</dt>
                <dd className="text-sm text-gray-900">
                  {selectedWorker.iqamaExpiryDate
                    ? format(new Date(selectedWorker.iqamaExpiryDate), 'PP')
                    : t('common.notAvailable')}
                </dd>
              </div>
            </dl>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('financial.receiptNumber')}
          </label>
          <input
            type="text"
            value={formData.receiptNumber}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('financial.incomeType')}
          </label>
          <select
            value={formData.incomeType}
            onChange={e => setFormData({ ...formData, incomeType: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">{t('common.select')}</option>
            <option value="kafalat">{t('financial.kafalat')}</option>
            <option value="iqama">{t('financial.iqama')}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('financial.amount')}
          </label>
          <input
            type="number"
            value={formData.amount}
            onChange={e => setFormData({ ...formData, amount: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('financial.governmentFee')}
          </label>
          <input
            type="number"
            value={formData.governmentFee}
            onChange={e => setFormData({ ...formData, governmentFee: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => onGenerateReceipt(formData)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          {t('financial.generateReceipt')}
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {t('common.save')}
        </button>
      </div>
    </form>
  );
} 