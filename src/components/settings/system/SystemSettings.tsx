import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Database, Save } from 'lucide-react';

interface SystemSettingsProps {
  settings: {
    dataRetentionPeriod: number;
    backupFrequency: string;
    maxFileSize: number;
    allowedFileTypes: string;
    enableAuditLog: boolean;
  };
  onSave: (settings: any) => void;
}

export function SystemSettings({ settings, onSave }: SystemSettingsProps) {
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
        <Database className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900">{t('settings.system')}</h3>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="dataRetentionPeriod" className="block text-sm font-medium text-gray-700">
            Data Retention Period (months)
          </label>
          <input
            type="number"
            name="dataRetentionPeriod"
            id="dataRetentionPeriod"
            min="1"
            value={formData.dataRetentionPeriod}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="backupFrequency" className="block text-sm font-medium text-gray-700">
            Backup Frequency
          </label>
          <select
            name="backupFrequency"
            id="backupFrequency"
            value={formData.backupFrequency}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label htmlFor="maxFileSize" className="block text-sm font-medium text-gray-700">
            Maximum File Size (MB)
          </label>
          <input
            type="number"
            name="maxFileSize"
            id="maxFileSize"
            min="1"
            value={formData.maxFileSize}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="allowedFileTypes" className="block text-sm font-medium text-gray-700">
            Allowed File Types (comma-separated)
          </label>
          <input
            type="text"
            name="allowedFileTypes"
            id="allowedFileTypes"
            value={formData.allowedFileTypes}
            onChange={handleChange}
            placeholder=".pdf, .jpg, .png"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="enableAuditLog"
              id="enableAuditLog"
              checked={formData.enableAuditLog}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="enableAuditLog" className="ml-2 block text-sm text-gray-700">
              Enable Audit Log
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>
    </form>
  );
}