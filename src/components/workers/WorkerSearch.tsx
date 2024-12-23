import { AdvancedSearch } from '../shared/AdvancedSearch';
import { useTranslation } from 'react-i18next';
import type { Worker } from '../../types';
import { storageService } from '../../services/storage';

interface WorkerSearchProps {
  onFilteredWorkersChange: (workers: Worker[]) => void;
}

export function WorkerSearch({ onFilteredWorkersChange }: WorkerSearchProps) {
  const { t } = useTranslation();
  const { data: organizations } = storageService.loadOrganizations();

  const searchFields = [
    {
      key: 'organization',
      label: t('workers.organization'),
      type: 'select' as const,
      options: organizations.map(org => ({
        value: org.name,
        label: `${org.name} - ${org.unifiedNumber}`
      }))
    },
    {
      key: 'nationality',
      label: t('workers.nationality'),
      type: 'text' as const
    },
    {
      key: 'iqamaExpiry',
      label: t('workers.iqamaExpiryDate'),
      type: 'dateRange' as const
    },
    {
      key: 'kafalatAmount',
      label: t('workers.kafalatAmount'),
      type: 'number' as const
    }
  ];

  const handleSearch = (filters: Record<string, any>) => {
    const { data: workers } = storageService.loadWorkers();
    
    const filtered = workers.filter(worker => {
      const matchesSearch = !filters.searchTerm || 
        worker.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        worker.workerId.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesOrg = !filters.organization || worker.organization === filters.organization;
      
      const matchesNationality = !filters.nationality || 
        worker.nationality.toLowerCase().includes(filters.nationality.toLowerCase());

      const matchesIqamaExpiry = !filters.iqamaExpiryStart || (
        new Date(worker.iqamaExpiryDate) >= new Date(filters.iqamaExpiryStart) &&
        new Date(worker.iqamaExpiryDate) <= new Date(filters.iqamaExpiryEnd || filters.iqamaExpiryStart)
      );

      const matchesKafalatAmount = !filters.kafalatAmount || 
        worker.kafalatAmount === Number(filters.kafalatAmount);

      return matchesSearch && matchesOrg && matchesNationality && 
        matchesIqamaExpiry && matchesKafalatAmount;
    });

    onFilteredWorkersChange(filtered);
  };

  return (
    <AdvancedSearch
      fields={searchFields}
      onSearch={handleSearch}
      placeholder={t('workers.searchPlaceholder')}
    />
  );
}