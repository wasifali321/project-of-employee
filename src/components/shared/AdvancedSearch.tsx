import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SearchField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'dateRange' | 'number';
  options?: { value: string; label: string }[];
}

interface AdvancedSearchProps {
  fields: SearchField[];
  onSearch: (filters: Record<string, any>) => void;
  placeholder?: string;
}

export function AdvancedSearch({ fields, onSearch, placeholder }: AdvancedSearchProps) {
  const { t } = useTranslation();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  const handleSearch = () => {
    onSearch({
      searchTerm,
      ...filters
    });
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    onSearch({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder={placeholder || t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border rounded-lg"
        >
          <Filter className="h-4 w-4" />
          {t('common.advancedSearch')}
        </button>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {t('common.search')}
        </button>
      </div>

      {showAdvanced && (
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                {field.type === 'select' ? (
                  <select
                    value={filters[field.key] || ''}
                    onChange={(e) => handleFilterChange(field.key, e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">{t('common.all')}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'dateRange' ? (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={filters[`${field.key}Start`] || ''}
                      onChange={(e) => handleFilterChange(`${field.key}Start`, e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <input
                      type="date"
                      value={filters[`${field.key}End`] || ''}
                      onChange={(e) => handleFilterChange(`${field.key}End`, e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <input
                    type={field.type}
                    value={filters[field.key] || ''}
                    onChange={(e) => handleFilterChange(field.key, e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              {t('common.clearFilters')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 