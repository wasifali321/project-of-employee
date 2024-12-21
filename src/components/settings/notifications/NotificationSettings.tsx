import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Save } from 'lucide-react';

interface NotificationSettingsProps {
  settings: {
    emailNotifications: boolean;
    documentExpiryAlert: boolean;
    kafalaDueAlert: boolean;
    alertDays: number;
    emailRecipients: string;
  };
  onSave: (settings: any) => void;
}

export function NotificationSettings({ settings, onSave }: NotificationSettingsProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900">{t('settings.notifications')}</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="emailNotifications"
            id="emailNotifications"
            checked={formData.emailNotifications}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
            {t('settings.notifications.enableEmail')}
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="documentExpiryAlert"
            id="documentExpiryAlert"
            checked={formData.documentExpiryAlert}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="documentExpiryAlert" className="ml-2 block text-sm text-gray-700">
            {t('settings.notifications.documentExpiry')}
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="kafalaDueAlert"
            id="kafalaDueAlert"
            checked={formData.kafalaDueAlert}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="kafalaDueAlert" className="ml-2 block text-sm text-gray-700">
            {t('settings.notifications.kafalaDue')}
          </label>
        </div>

        <div>
          <label htmlFor="alertDays" className="block text-sm font-medium text-gray-700">
            {t('settings.notifications.alertDays')}
          </label>
          <input
            type="number"
            name="alertDays"
            id="alertDays"
            min="1"
            max="90"
            value={formData.alertDays}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="emailRecipients" className="block text-sm font-medium text-gray-700">
            {t('settings.notifications.recipients')}
          </label>
          <input
            type="text"
            name="emailRecipients"
            id="emailRecipients"
            value={formData.emailRecipients}
            onChange={handleChange}
            placeholder="email1@example.com, email2@example.com"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            {t('settings.notifications.recipientsHelp')}
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