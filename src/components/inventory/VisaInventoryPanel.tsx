/*import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Plus, Filter } from 'lucide-react';
import { VisaForm } from './VisaForm';
import { VisaList } from './VisaList';
import { VisaStats } from './VisaStats';
import type { Visa, Organization } from '../../types';

interface VisaInventoryPanelProps {
  visas: Visa[];
  organizations: Organization[];
  onAddVisa: (visa: Omit<Visa, 'id'>) => void;
  onUpdateVisa: (visa: Visa) => void;
  onDeleteVisa: (visaId: string) => void;
}

export function VisaInventoryPanel({
  visas,
  organizations,
  onAddVisa,
  onUpdateVisa,
  onDeleteVisa
}: VisaInventoryPanelProps) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingVisa, setEditingVisa] = useState<Visa | null>(null);
  const [filterOrg, setFilterOrg] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleSubmit = (visaData: Omit<Visa, 'id'>) => {
    if (editingVisa) {
      onUpdateVisa({ ...visaData, id: editingVisa.id });
    } else {
      onAddVisa(visaData);
    }
    setShowForm(false);
    setEditingVisa(null);
  };

  const filteredVisas = visas.filter(visa => {
    const matchesOrg = filterOrg === 'all' || visa.organizationId === filterOrg;
    const matchesStatus = filterStatus === 'all' || visa.status === filterStatus;
    return matchesOrg && matchesStatus;
  });

  const stats = {
    total: visas.length,
    available: visas.filter(v => v.status === 'available').length,
    reserved: visas.filter(v => v.status === 'reserved').length,
    used: visas.filter(v => v.status === 'used').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Visa Inventory</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? 'Cancel' : 'Add Visa'}
        </button>
      </div>

      <VisaStats stats={stats} />

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <VisaForm
            onSubmit={handleSubmit}
            initialData={editingVisa}
            organizations={organizations}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="orgFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Organization
            </label>
            <select
              id="orgFilter"
              value={filterOrg}
              onChange={(e) => setFilterOrg(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Organizations</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="statusFilter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="used">Used</option>
            </select>
          </div>
        </div>

        <VisaList
          visas={filteredVisas}
          organizations={organizations}
          onEdit={(visa) => {
            setEditingVisa(visa);
            setShowForm(true);
          }}
          onDelete={onDeleteVisa}
        />
      </div>
    </div>
  );
}
*/
