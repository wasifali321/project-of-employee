import { FilterBar } from '../shared/FilterBar';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import type { Organization, VisaService } from '../../types/index';
import { VisaServiceList } from './VisaServiceList';

interface VisaServicePanelProps {
  services: VisaService[];
  organizations: Organization[];
}

export function VisaServicePanel({ services, organizations }: VisaServicePanelProps) {
  const { t } = useTranslation();
  const [filteredServices, setFilteredServices] = useState(services);

  const handleFilterChange = (filters: Record<string, any>) => {
    let filtered = [...services];
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(service => 
        service.customerName.toLowerCase().includes(search) ||
        service.passportNumber.toLowerCase().includes(search)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(service => service.status === filters.status);
    }

    if (filters.organization) {
      filtered = filtered.filter(service => service.organization === filters.organization);
    }

    if (filters.dateStart && filters.dateEnd) {
      const start = new Date(filters.dateStart);
      const end = new Date(filters.dateEnd);
      filtered = filtered.filter(service => {
        const date = new Date(service.date);
        return date >= start && date <= end;
      });
    }

    setFilteredServices(filtered);
  };

  const visaFilters = [
    {
      key: 'status',
      label: t('visa.status'),
      type: 'select' as const,
      options: [
        { value: 'available', label: t('visa.available') },
        { value: 'reserved', label: t('visa.reserved') },
        { value: 'used', label: t('visa.used') }
      ]
    },
    {
      key: 'organization',
      label: t('visa.organization'),
      type: 'select' as const,
      options: organizations.map((org: Organization) => ({
        value: org.name,
        label: org.name
      }))
    },
    {
      key: 'date',
      label: t('visa.date'),
      type: 'dateRange' as const
    }
  ];

  return (
    <div className="space-y-6">
      <FilterBar 
        filters={visaFilters}
        onFilterChange={handleFilterChange}
      />
      
      <VisaServiceList 
        services={filteredServices}
        // ... other props
      />
    </div>
  );
} 