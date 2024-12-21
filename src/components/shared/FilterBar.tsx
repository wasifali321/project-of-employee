import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter } from 'lucide-react';

interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'dateRange';
  options?: { value: string; label: string }[];
}

interface FilterBarProps {
  filters: FilterOption[];
  onFilterChange: (filters: Record<string, any>) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const { t } = useTranslation();
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filterValues, [key]: value };
    setFilterValues(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('common.search')}
            className="border-0 focus:ring-0 text-sm"
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <Filter className="h-4 w-4 mr-1" />
          {t('common.filters')}
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          {filters.map((filter) => (
            <div key={filter.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {filter.label}
              </label>
              {filter.type === 'select' ? (
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  value={filterValues[filter.key] || ''}
                >
                  <option value="">{t('common.all')}</option>
                  {filter.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : filter.type === 'dateRange' ? (
                <div className="flex space-x-2">
                  <input
                    type="date"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    onChange={(e) => handleFilterChange(`${filter.key}Start`, e.target.value)}
                  />
                  <input
                    type="date"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    onChange={(e) => handleFilterChange(`${filter.key}End`, e.target.value)}
                  />
                </div>
              ) : (
                <input
                  type={filter.type}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  value={filterValues[filter.key] || ''}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}