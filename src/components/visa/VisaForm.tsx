import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Visa } from '../../types';

interface VisaFormProps {
  onSubmit: (visa: Partial<Visa>) => void;
  onCancel: () => void;
  initialData?: Visa;
}

export function VisaForm({ onSubmit, onCancel, initialData }: VisaFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<Visa>>(
    initialData || {
      visaNumber: '',
      borderNumber: '',
      profession: '',
      nationality: '',
      type: 'new',
      gender: 'male',
      price: 0,
      purchaseDate: '',
      expiryDate: '',
      notes: ''
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData) {
      // Clear form after submission if it's a new visa
      setFormData({
        visaNumber: '',
        borderNumber: '',
        profession: '',
        nationality: '',
        type: 'new',
        gender: 'male',
        price: 0,
        purchaseDate: '',
        expiryDate: '',
        notes: ''
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visa Number */}
        <div>
          <label htmlFor="visaNumber" className="block text-sm font-medium text-gray-700">
            {t('visa.visaNumber')}
          </label>
          <input
            type="text"
            id="visaNumber"
            name="visaNumber"
            required
            value={formData.visaNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Border Number */}
        <div>
          <label htmlFor="borderNumber" className="block text-sm font-medium text-gray-700">
            {t('visa.borderNumber')}
          </label>
          <input
            type="text"
            id="borderNumber"
            name="borderNumber"
            required
            value={formData.borderNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Profession */}
        <div>
          <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
            {t('visa.profession')}
          </label>
          <input
            type="text"
            id="profession"
            name="profession"
            required
            value={formData.profession}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Nationality */}
        <div>
          <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
            {t('visa.nationality')}
          </label>
          <input
            type="text"
            id="nationality"
            name="nationality"
            required
            value={formData.nationality}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            {t('visa.type')}
          </label>
          <select
            id="type"
            name="type"
            required
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="new">{t('visa.new')}</option>
            <option value="transfer">{t('visa.transfer')}</option>
            <option value="renewal">{t('visa.renewal')}</option>
          </select>
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            {t('visa.gender')}
          </label>
          <select
            id="gender"
            name="gender"
            required
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="male">{t('visa.male')}</option>
            <option value="female">{t('visa.female')}</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            {t('visa.price')}
          </label>
          <input
            type="number"
            id="price"
            name="price"
            required
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Purchase Date */}
        <div>
          <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">
            {t('visa.purchaseDate')}
          </label>
          <input
            type="date"
            id="purchaseDate"
            name="purchaseDate"
            required
            value={formData.purchaseDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
            {t('visa.expiryDate')}
          </label>
          <input
            type="date"
            id="expiryDate"
            name="expiryDate"
            required
            value={formData.expiryDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          {t('visa.notes')}
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {initialData ? t('common.update') : t('common.save')}
        </button>
      </div>
    </form>
  );
} 