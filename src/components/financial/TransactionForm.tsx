import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FinancialTransaction, Visa } from '../../types/index';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<FinancialTransaction, 'id'>) => void;
  initialData?: FinancialTransaction;
  visas?: Visa[];
}

export function TransactionForm({ onSubmit, initialData, visas }: TransactionFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<FinancialTransaction>>({
    amount: initialData?.amount || 0,
    description: initialData?.description || '',
    category: initialData?.category || 'other',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    reference: initialData?.reference || '',
    paymentMethod: initialData?.paymentMethod || 'cash',
    type: initialData?.type || 'expense',
    status: initialData?.status || 'pending',
    source: initialData?.source || 'other'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData as Omit<FinancialTransaction, 'id'>);
  };

  const availableVisas = visas?.filter(visa => visa.status === 'available') || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            {t('financial.transactionType')} <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="income">{t('financial.income')}</option>
            <option value="expense">{t('financial.expense')}</option>
            <option value="refund">{t('financial.refund')}</option>
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            {t('financial.amount')} <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="block w-full rounded-md border-gray-300 pr-12 focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">SAR</span>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            {t('financial.category')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            {t('financial.date')} <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            {t('financial.description')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
            {t('financial.reference')}
          </label>
          <input
            type="text"
            id="reference"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
            {t('financial.paymentMethod')} <span className="text-red-500">*</span>
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="cash">{t('financial.cash')}</option>
            <option value="bank">{t('financial.bank')}</option>
            <option value="card">{t('financial.card')}</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            {t('financial.status')} <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="completed">{t('financial.completed')}</option>
            <option value="pending">{t('financial.pending')}</option>
            <option value="cancelled">{t('financial.cancelled')}</option>
          </select>
        </div>

        {formData.type === 'income' && (
          <div>
            <label htmlFor="visaId" className="block text-sm font-medium text-gray-700">
              {t('financial.visa')}
            </label>
            <select
              id="visaId"
              name="visaId"
              value={formData.visaId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">{t('common.select')}</option>
              {availableVisas.map((visa) => (
                <option key={visa.id} value={visa.id}>
                  {`${visa.visaNumber} - ${visa.profession}`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {initialData ? t('common.update') : t('common.add')}
        </button>
      </div>
    </form>
  );
}