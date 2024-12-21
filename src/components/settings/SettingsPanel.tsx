import { useState } from 'react';
import { Save, Building2, Bell, Shield, Database, Globe } from 'lucide-react';
import type { Settings } from '../../types';
import { LogoUpload } from './LogoUpload';

export function SettingsPanel() {
  const [settings, setSettings] = useState<Settings>({
    general: {
      companyName: '',
      companyLogo: '',
      defaultLanguage: 'en',
      timeZone: 'Asia/Riyadh',
      dateFormat: 'DD/MM/YYYY',
      currency: 'SAR'
    },
    notifications: {
      emailNotifications: true,
      documentExpiryAlert: true,
      kafalaDueAlert: true,
      alertDays: 30,
      emailRecipients: ''
    },
    security: {
      requireTwoFactor: false,
      passwordExpiry: 90,
      sessionTimeout: 30,
      allowedIPs: [],
      loginAttempts: 3
    },
    system: {
      dataRetentionPeriod: 365,
      backupFrequency: 'daily',
      maxFileSize: 10,
      allowedFileTypes: '.pdf,.jpg,.png',
      enableAuditLog: true
    }
  });

  const handleChange = (section: keyof Settings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save all settings to localStorage
    localStorage.setItem('appSettings', JSON.stringify(settings));
    // Show success message
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Settings</h2>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Save className="h-5 w-5" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-medium">Company Settings</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                value={settings.general.companyName}
                onChange={e => handleChange('general', 'companyName', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <LogoUpload
              currentLogo={settings.general.companyLogo}
              onLogoChange={(logo) => handleChange('general', 'companyLogo', logo)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">Default Language</label>
              <select
                value={settings.general.defaultLanguage}
                onChange={e => handleChange('general', 'defaultLanguage', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date Format</label>
              <select
                value={settings.general.dateFormat}
                onChange={e => handleChange('general', 'dateFormat', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-medium">Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={settings.notifications.emailNotifications}
                onChange={e => handleChange('notifications', 'emailNotifications', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="emailNotifications" className="text-sm text-gray-700">
                Enable Email Notifications
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="documentExpiryAlert"
                checked={settings.notifications.documentExpiryAlert}
                onChange={e => handleChange('notifications', 'documentExpiryAlert', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="documentExpiryAlert" className="text-sm text-gray-700">
                Document Expiry Alerts
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Alert Days Before Expiry</label>
              <input
                type="number"
                value={settings.notifications.alertDays}
                onChange={e => handleChange('notifications', 'alertDays', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-medium">Security</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="twoFactor"
                checked={settings.security.requireTwoFactor}
                onChange={e => handleChange('security', 'requireTwoFactor', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="twoFactor" className="text-sm text-gray-700">
                Require Two-Factor Authentication
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password Expiry (days)</label>
              <input
                type="number"
                value={settings.security.passwordExpiry}
                onChange={e => handleChange('security', 'passwordExpiry', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={e => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-medium">System</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Data Retention Period (days)</label>
              <input
                type="number"
                value={settings.system.dataRetentionPeriod}
                onChange={e => handleChange('system', 'dataRetentionPeriod', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Backup Frequency</label>
              <select
                value={settings.system.backupFrequency}
                onChange={e => handleChange('system', 'backupFrequency', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="auditLog"
                checked={settings.system.enableAuditLog}
                onChange={e => handleChange('system', 'enableAuditLog', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="auditLog" className="text-sm text-gray-700">
                Enable Audit Log
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 