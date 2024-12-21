import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Save } from 'lucide-react';
import type { SecuritySettings as SecuritySettingsType } from '../../../types';

interface SecuritySettingsProps {
  settings: SecuritySettingsType;
  onSave: (settings: SecuritySettingsType) => void;
}

export function SecuritySettings({ settings, onSave }: SecuritySettingsProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? parseInt(value) 
          : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900">{t('settings.security')}</h3>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="requireTwoFactor"
            name="requireTwoFactor"
            checked={formData.requireTwoFactor}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="requireTwoFactor" className="ml-2 block text-sm text-gray-700">
            {t('settings.security.requireTwoFactor')}
          </label>
        </div>

        <div>
          <label htmlFor="passwordExpiry" className="block text-sm font-medium text-gray-700">
            {t('settings.security.passwordExpiry')}
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="number"
              name="passwordExpiry"
              id="passwordExpiry"
              value={formData.passwordExpiry}
              onChange={handleChange}
              min="0"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              {t('settings.security.days')}
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
            {t('settings.security.sessionTimeout')}
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="number"
              name="sessionTimeout"
              id="sessionTimeout"
              value={formData.sessionTimeout}
              onChange={handleChange}
              min="1"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              {t('settings.security.minutes')}
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="loginAttempts" className="block text-sm font-medium text-gray-700">
            {t('settings.security.loginAttempts')}
          </label>
          <input
            type="number"
            name="loginAttempts"
            id="loginAttempts"
            value={formData.loginAttempts}
            onChange={handleChange}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="allowedIPs" className="block text-sm font-medium text-gray-700">
            {t('settings.security.allowedIPs')}
          </label>
          <input
            type="text"
            name="allowedIPs"
            id="allowedIPs"
            value={formData.allowedIPs.join(', ')}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              allowedIPs: e.target.value.split(',').map(ip => ip.trim()).filter(Boolean)
            }))}
            placeholder="192.168.1.1, 10.0.0.0/24"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            {t('settings.security.allowedIPsHelp')}
          </p>
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