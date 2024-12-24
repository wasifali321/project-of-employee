import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Filter, X } from 'lucide-react';
import { VisaForm } from './VisaForm';
import { storageService } from '../../services/storage';
import type { Visa } from '../../types';

export function VisaPanel() {
  const { t } = useTranslation();
  const [visas, setVisas] = useState<Visa[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [selectedVisa, setSelectedVisa] = useState<Visa | null>(null);

  useEffect(() => {
    console.log('VisaPanel mounted');
    loadVisas();
  }, []);

  const loadVisas = () => {
    console.log('Loading visas...');
    try {
      const { data } = storageService.loadVisas();
      console.log('Loaded visas:', data);
      setVisas(data);
    } catch (error) {
      console.error('Error loading visas:', error);
    }
  };

  const handleSubmit = async (visaData: Partial<Visa>) => {
    try {
      if (selectedVisa) {
        await storageService.updateVisa(selectedVisa.id, visaData);
      } else {
        await storageService.addVisa(visaData);
      }
      loadVisas();
      setShowForm(true);
      setSelectedVisa(null);
    } catch (error) {
      console.error('Error saving visa:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('visa.inventory')}</h1>
      </div>

      {/* Visa Form - Always visible */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">
          {selectedVisa ? t('visa.editVisa') : t('visa.addVisa')}
        </h2>
        <VisaForm
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(true);
            setSelectedVisa(null);
          }}
          initialData={selectedVisa || undefined}
        />
      </div>

      {/* Visa List */}
      {visas.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('visa.visaNumber')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('visa.profession')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('visa.nationality')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('visa.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('visa.type')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('visa.price')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visas.map((visa) => (
                <tr 
                  key={visa.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedVisa(visa);
                    setShowForm(true);
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {visa.visaNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {visa.profession}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {visa.nationality}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {t(`visa.${visa.status}`)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {t(`visa.${visa.type}`)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {visa.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 