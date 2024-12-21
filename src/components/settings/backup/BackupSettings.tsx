import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Database, Download, Upload, Save } from 'lucide-react';

interface BackupSettingsProps {
  onBackup: () => void;
  onRestore: (file: File) => void;
}

export function BackupSettings({ onBackup, onRestore }: BackupSettingsProps) {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRestore = () => {
    if (selectedFile) {
      onRestore(selectedFile);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Database className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900">{t('settings.backup.title')}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-base font-medium text-gray-900 mb-4">
            {t('settings.backup.createBackup')}
          </h4>
          <p className="text-sm text-gray-500 mb-4">
            {t('settings.backup.createBackupDescription')}
          </p>
          <button
            onClick={onBackup}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            {t('settings.backup.downloadBackup')}
          </button>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-base font-medium text-gray-900 mb-4">
            {t('settings.backup.restoreBackup')}
          </h4>
          <p className="text-sm text-gray-500 mb-4">
            {t('settings.backup.restoreBackupDescription')}
          </p>
          <div className="space-y-4">
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {selectedFile && (
              <button
                onClick={handleRestore}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                {t('settings.backup.restore')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}