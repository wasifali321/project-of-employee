import { useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import { OrganizationList } from './OrganizationList';
import { OrganizationForm } from './OrganizationForm';
import { BulkOrganizationEntry } from './BulkOrganizationEntry';
import { storageService } from '../../services/storage';
import type { Organization } from '../../types';

export function OrganizationPanel() {
  const [showForm, setShowForm] = useState(false);
  const [showBulkEntry, setShowBulkEntry] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const { data: organizations } = storageService.loadOrganizations();

  const handleAdd = (organization: Omit<Organization, 'id'>) => {
    storageService.saveOrganization({
      ...organization,
      id: Date.now().toString()
    });
    setShowForm(false);
    window.location.reload(); // Refresh to show new data
  };

  const handleEdit = (organization: Organization) => {
    setEditingOrg(organization);
    setShowForm(true);
  };

  const handleUpdate = (updatedOrg: Organization) => {
    storageService.updateOrganization(updatedOrg);
    setEditingOrg(null);
    setShowForm(false);
    window.location.reload(); // Refresh to show updated data
  };

  const handleDelete = (orgId: string) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      storageService.deleteOrganization(orgId);
      window.location.reload(); // Refresh to show updated data
    }
  };

  const handleBulkAdd = (organizations: Omit<Organization, 'id'>[]) => {
    organizations.forEach(org => {
      storageService.saveOrganization({
        ...org,
        id: Date.now().toString()
      });
    });
    setShowBulkEntry(false);
    window.location.reload(); // Refresh to show new data
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Organizations</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Add Organization
          </button>
          <button
            onClick={() => setShowBulkEntry(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            <Upload className="h-5 w-5" />
            Bulk Upload
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-6">
          <OrganizationForm 
            onSubmit={editingOrg ? handleUpdate : handleAdd}
            onCancel={() => {
              setShowForm(false);
              setEditingOrg(null);
            }}
            initialData={editingOrg}
          />
        </div>
      )}

      {showBulkEntry && (
        <div className="mb-6">
          <BulkOrganizationEntry 
            onSubmit={handleBulkAdd} 
            onCancel={() => setShowBulkEntry(false)} 
          />
        </div>
      )}

      <OrganizationList 
        organizations={organizations} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}