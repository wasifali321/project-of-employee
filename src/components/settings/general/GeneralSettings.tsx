import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Save } from 'lucide-react';
import { LogoSettings } from './LogoSettings';
import { useSettings } from '../SettingsContext';

export function GeneralSettings() {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState(settings.general);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (logo: string) => {
    setFormData(prev => ({
      ...prev,
      companyLogo: logo
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings('general', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center gap-2 mb-6">
        <Globe className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900">{t('settings.general')}</h3>
      </div>

      <div className="space-y-8">
        <div>
          <h4 className="text-base font-medium text-gray-900 mb-4">
            {t('settings.company.title')}
          </h4>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                {t('settings.company.name')}
              </label>
              <input
                type="text"
                name="companyName"
                id="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <LogoSettings
              currentLogo={formData.companyLogo}
              onLogoChange={handleLogoChange}
            />
          </div>
        </div>

        <div>
          <h4 className="text-base font-medium text-gray-900 mb-4">
            {t('settings.localization.title')}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="defaultLanguage" className="block text-sm font-medium text-gray-700">
                {t('settings.localization.language')}
              </label>
              <select
                name="defaultLanguage"
                id="defaultLanguage"
                value={formData.defaultLanguage}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="ur">اردو</option>
              </select>
            </div>

            <div>
              <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700">
                {t('settings.localization.timezone')}
              </label>
              <select
                name="timeZone"
                id="timeZone"
                value={formData.timeZone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Asia/Riyadh">Arabia Standard Time (Riyadh)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>

            <div>
              <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
                {t('settings.localization.dateFormat')}
              </label>
              <select
                name="dateFormat"
                id="dateFormat"
                value={formData.dateFormat}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                {t('settings.localization.currency')}
              </label>
              <select
                name="currency"
                id="currency"
                value={formData.currency}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="SAR">Saudi Riyal (SAR)</option>
                <option value="USD">US Dollar (USD)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save className="h-4 w-4 mr-2" />
          {t('common.save')}
        </button>
      </div>
    </form>
  );
}