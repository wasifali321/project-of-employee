import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { storageService } from '../../services/storage';
import { VisaForm } from './VisaForm';
import { VisaList } from './VisaList';
import type { Visa } from '../../types';

export function VisaInventoryPanel() {
  console.log('VisaInventoryPanel mounting'); // Debug log on mount

  const { t } = useTranslation();
  const [visas, setVisas] = useState<Visa[]>([]);
  const [selectedVisa, setSelectedVisa] = useState<Visa | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'reserved' | 'used'>('all');

  useEffect(() => {
    console.log('VisaInventoryPanel useEffect running'); // Debug log in useEffect
    loadVisas();
  }, []);

  const loadVisas = () => {
    try {
      const { data } = storageService.loadVisas();
      console.log('Loaded visas:', data); // Debug log
      setVisas(data);
    } catch (error) {
      console.error('Error loading visas:', error);
    }
  };

  const handleSubmit = async (visaData: Partial<Visa>) => {
    try {
      console.log('Submitting visa data:', visaData); // Debug log
      if (selectedVisa) {
        await storageService.updateVisa(selectedVisa.id, visaData);
      } else {
        const newVisa = await storageService.addVisa(visaData);
        console.log('New visa added:', newVisa); // Debug log
      }
      loadVisas();
      setSelectedVisa(null);
    } catch (error) {
      console.error('Error saving visa:', error);
    }
  };

  const filteredVisas = visas.filter(visa => {
    const matchesSearch = 
      visa.visaNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visa.profession?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visa.nationality?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || visa.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('visa.inventory')}</h1>
      </div>

      {/* Visa Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">
          {selectedVisa ? t('visa.editVisa') : t('visa.addVisa')}
        </h2>
        <VisaForm
          onSubmit={handleSubmit}
          onCancel={() => setSelectedVisa(null)}
          initialData={selectedVisa}
        />
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder={t('visa.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="all">{t('common.all')}</option>
            <option value="available">{t('visa.available')}</option>
            <option value="reserved">{t('visa.reserved')}</option>
            <option value="used">{t('visa.used')}</option>
          </select>
        </div>
      </div>

      {/* Visa List */}
      <VisaList 
        visas={filteredVisas}
        onVisaClick={(visa) => setSelectedVisa(visa)}
      />
    </div>
  );
} 