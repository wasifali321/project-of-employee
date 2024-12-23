import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Visa } from '../../types';
import { storageService } from '../../services/storage';

interface VisaFormProps {
  onSubmit: (visa: Omit<Visa, 'id'>) => void;
  onCancel: () => void;
  initialData?: Visa;
}

export function VisaForm({ onSubmit, onCancel, initialData }: VisaFormProps) {
  console.log('VisaForm rendering', { initialData }); // Debug log
  
  const { t } = useTranslation();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    visaNumber: initialData?.visaNumber || '',
    borderNumber: initialData?.borderNumber || '',
    quantity: initialData?.quantity || 1,
    nationality: initialData?.nationality || '',
    profession: initialData?.profession || '',
    organizationId: initialData?.organizationId || '',
    agencyName: initialData?.agencyName || '',
    status: initialData?.status || 'available',
    type: initialData?.type || 'new',
    price: initialData?.price || 0,
    purchaseDate: initialData?.purchaseDate || '',
    expiryDate: initialData?.expiryDate || '',
    notes: initialData?.notes || ''
  });

  useEffect(() => {
    const { data } = storageService.loadOrganizations();
    setOrganizations(data);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold mb-6">
        {initialData ? t('visa.editVisa') : t('visa.addVisa')}
      </h2>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('visa.visaNumber')}
          </label>
          <input
            type="text"
            required
            value={formData.visaNumber}
            onChange={e => setFormData(prev => ({ ...prev, visaNumber: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('visa.borderNumber')}
          </label>
          <input
            type="text"
            required
            value={formData.borderNumber}
            onChange={e => setFormData(prev => ({ ...prev, borderNumber: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('visa.organization')}
          </label>
          <select
            required
            value={formData.organizationId}
            onChange={e => setFormData(prev => ({ ...prev, organizationId: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">{t('common.select')}</option>
            {organizations.map(org => (
              <option key={org.id} value={org.id}>
                {org.name} ({org.crNumber})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('visa.quantity')}
          </label>
          <input
            type="number"
            min="1"
            required
            value={formData.quantity}
            onChange={e => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('visa.nationality')}
          </label>
          <input
            type="text"
            required
            value={formData.nationality}
            onChange={e => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('visa.profession')}
          </label>
          <input
            type="text"
            required
            value={formData.profession}
            onChange={e => setFormData(prev => ({ ...prev, profession: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('visa.agency')}
          </label>
          <input
            type="text"
            required
            value={formData.agencyName}
            onChange={e => setFormData(prev => ({ ...prev, agencyName: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('visa.price')}
          </label>
          <input
            type="number"
            required
            value={formData.price}
            onChange={e => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('visa.purchaseDate')}
          </label>
          <input
            type="date"
            required
            value={formData.purchaseDate}
            onChange={e => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('visa.expiryDate')}
          </label>
          <input
            type="date"
            required
            value={formData.expiryDate}
            onChange={e => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            {t('visa.notes')}
          </label>
          <textarea
            value={formData.notes}
            onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {initialData ? t('common.update') : t('common.add')}
        </button>
      </div>
    </form>
  );
} 