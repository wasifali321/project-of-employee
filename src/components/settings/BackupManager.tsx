import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Upload, AlertCircle } from 'lucide-react';
import { backupService } from '../../services/backup';

export function BackupManager() {
  const { t } = useTranslation();
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleExport = async () => {
    try {
      setError(null);
      setSuccess(null);
      await backupService.exportBackup();
      setSuccess(t('backup.exportSuccess'));
    } catch (err: any) {
      console.error('Backup export error:', err);
      setError(err.message || t('backup.exportError'));
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setError(null);
    setSuccess(null);

    try {
      await backupService.importBackup(file);
      setSuccess(t('backup.importSuccess'));
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      console.error('Backup import error:', err);
      setError(err.message || t('backup.importError'));
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">{t('backup.title')}</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{t('backup.export')}</h4>
              <p className="text-sm text-gray-500">{t('backup.exportDescription')}</p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              {t('backup.downloadBackup')}
            </button>
          </div>

          <div className="border-t pt-4">
            <div>
              <h4 className="font-medium">{t('backup.import')}</h4>
              <p className="text-sm text-gray-500">{t('backup.importDescription')}</p>
            </div>
            <div className="mt-2">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
                className="hidden"
                id="backup-file"
              />
              <label
                htmlFor="backup-file"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                {isImporting ? t('backup.importing') : t('backup.selectFile')}
              </label>
            </div>
          </div>

          {(error || success) && (
            <div className={`p-4 rounded-md ${error ? 'bg-red-50' : 'bg-green-50'}`}>
              <div className="flex items-center">
                <AlertCircle className={`h-5 w-5 ${error ? 'text-red-400' : 'text-green-400'}`} />
                <p className={`ml-3 text-sm ${error ? 'text-red-800' : 'text-green-800'}`}>
                  {error || success}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 