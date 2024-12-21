import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Visa, Organization } from '../../types';

interface VisaFormProps {
  onSubmit: (visa: Omit<Visa, 'id'>) => void;
  initialData?: Visa;
  organizations: Organization[];
}

export function VisaForm({ onSubmit, initialData, organizations }: VisaFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    visaNumber: initialData?.visaNumber || '',
    unifiedNumber: initialData?.unifiedNumber || '',
    organizationId: initialData?.organizationId || '',
    profession: initialData?.profession || '',
    quantity: initialData?.quantity || 1,
    status: initialData?.status || 'available',
    dateAdded: initialData?.dateAdded || new Date().toISOString(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const professions = [
    'Driver',
    'Construction Worker',
    'Domestic Worker',
    'Electrician',
    'Plumber',
    'Chef',
    'Gardener',
    'Security Guard',
    'Cleaner',
    'Other'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="visaNumber" className="block text-sm font-medium text-gray-700">
            {t('visa.visaNumber')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="visaNumber"
            name="visaNumber"
            value={formData.visaNumber}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="unifiedNumber" className="block text-sm font-medium text-gray-700">
            {t('visa.unifiedNumber')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="unifiedNumber"
            name="unifiedNumber"
            value={formData.unifiedNumber}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
            {t('visa.profession')} <span className="text-red-500">*</span>
          </label>
          <select
            id="profession"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">{t('common.select')}</option>
            {professions.map(profession => (
              <option key={profession} value={profession}>{profession}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="organizationId" className="block text-sm font-medium text-gray-700">
            {t('visa.organization')} <span className="text-red-500">*</span>
          </label>
          <select
            id="organizationId"
            name="organizationId"
            value={formData.organizationId}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">{t('common.select')}</option>
            {organizations.map(org => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            {t('visa.quantity')} <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            {t('visa.status')}
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="available">{t('visa.available')}</option>
            <option value="reserved">{t('visa.reserved')}</option>
            <option value="used">{t('visa.used')}</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {initialData ? t('common.update') : t('common.add')}
        </button>
      </div>
    </form>
  );
}