import { storageService } from './storage';
import { format } from 'date-fns';

interface BackupData {
  workers: any[];
  organizations: any[];
  transactions: any[];
  settings: any;
  timestamp: string;
  version: string;
}

export const backupService = {
  createBackup(): BackupData {
    try {
      const { data: workers } = storageService.loadWorkers();
      const { data: organizations } = storageService.loadOrganizations();
      const { data: transactions } = storageService.loadTransactions();
      const settings = localStorage.getItem('appSettings');

      const backup: BackupData = {
        workers: workers || [],
        organizations: organizations || [],
        transactions: transactions || [],
        settings: settings ? JSON.parse(settings) : {},
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };

      return backup;
    } catch (error) {
      console.error('Error creating backup:', error);
      throw new Error('Failed to create backup: ' + error.message);
    }
  },

  async exportBackup(): Promise<void> {
    try {
      const backup = this.createBackup();
      const fileName = `backup-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.json`;
      const json = JSON.stringify(backup, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error exporting backup:', error);
      throw new Error('Failed to export backup: ' + error.message);
    }
  },

  async importBackup(file: File): Promise<void> {
    try {
      const text = await file.text();
      const backup: BackupData = JSON.parse(text);

      // Validate backup version and structure
      if (!backup.version || !backup.timestamp) {
        throw new Error('Invalid backup file format');
      }

      // Clear existing data
      localStorage.clear();
      
      // Restore data with error handling for each section
      try {
        if (backup.workers?.length) {
          backup.workers.forEach(worker => storageService.saveWorker(worker));
        }
        
        if (backup.organizations?.length) {
          backup.organizations.forEach(org => storageService.saveOrganization(org));
        }
        
        if (backup.transactions?.length) {
          backup.transactions.forEach(tx => storageService.saveTransaction(tx));
        }
        
        if (backup.settings) {
          localStorage.setItem('appSettings', JSON.stringify(backup.settings));
        }
      } catch (error) {
        console.error('Error restoring backup data:', error);
        throw new Error('Failed to restore backup data: ' + error.message);
      }
    } catch (error) {
      console.error('Error importing backup:', error);
      throw new Error('Failed to import backup: ' + error.message);
    }
  }
}; 