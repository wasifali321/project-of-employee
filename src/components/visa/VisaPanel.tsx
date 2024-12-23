import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { VisaList } from './VisaList';
import { VisaForm } from './VisaForm';
import { VisaView } from './VisaView';
import { VisaStats } from './VisaStats';
import { storageService } from '../../services/storage';
import type { Visa } from '../../types';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export function VisaPanel() {
  console.log('VisaPanel rendering');

  const { t } = useTranslation();
  const [visas, setVisas] = useState<Visa[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVisa, setEditingVisa] = useState<Visa | null>(null);
  const [viewingVisa, setViewingVisa] = useState<Visa | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<Visa['status'] | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading visas...');
        const { data } = storageService.loadVisas();
        console.log('Loaded visas:', data);
        setVisas(data);
      } catch (error) {
        console.error('Error loading visas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAdd = (visa: Omit<Visa, 'id'>) => {
    console.log('Adding new visa:', visa);
    const newVisa = {
      ...visa,
      id: crypto.randomUUID()
    };
    storageService.saveVisa(newVisa as Visa);
    setVisas(prev => [...prev, newVisa as Visa]);
    setShowForm(false);
  };

  const handleEdit = (visa: Visa) => {
    storageService.updateVisa(visa);
    setVisas(prev => prev.map(v => v.id === visa.id ? visa : v));
    setEditingVisa(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('visa.deleteConfirm'))) {
      storageService.deleteVisa(id);
      setVisas(prev => prev.filter(v => v.id !== id));
    }
  };

  const handleAssign = (visa: Visa) => {
    // Implement worker assignment logic
    console.log('Assign visa:', visa);
  };

  const filteredVisas = visas.filter(visa => {
    const matchesSearch = visa.visaNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visa.profession.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || visa.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  console.log('Current state:', {
    showForm,
    editingVisa,
    visasCount: visas.length,
    isLoading
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('visa.inventory')}
        </h1>
        <button
          onClick={() => {
            console.log('Add button clicked');
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          {t('visa.addVisa')}
        </button>
      </div>

      <div className="mb-6">
        <VisaStats visas={visas} />
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder={t('common.search')}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md flex-1"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as Visa['status'] | 'all')}
          className="px-4 py-2 border rounded-md"
        >
          <option value="all">{t('common.all')}</option>
          <option value="available">{t('visa.available')}</option>
          <option value="reserved">{t('visa.reserved')}</option>
          <option value="used">{t('visa.used')}</option>
        </select>
      </div>

      <VisaList
        visas={filteredVisas}
        onEdit={setEditingVisa}
        onDelete={handleDelete}
        onAssign={handleAssign}
        onView={setViewingVisa}
      />

      {(showForm || editingVisa) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <VisaForm
                onSubmit={editingVisa ? handleEdit : handleAdd}
                onCancel={() => {
                  console.log('Form cancelled');
                  setShowForm(false);
                  setEditingVisa(null);
                }}
                initialData={editingVisa || undefined}
              />
            </div>
          </div>
        </div>
      )}

      {viewingVisa && (
        <VisaView
          visa={viewingVisa}
          onClose={() => setViewingVisa(null)}
        />
      )}
    </div>
  );
} 