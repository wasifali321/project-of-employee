import React, { useState } from 'react';
import { storageService } from '../../services/storage';
import { KafalatMonthSelector } from './KafalatMonthSelector';
import type { Worker } from '../../types';

interface WorkerFormProps {
  onSubmit: (worker: Worker) => void;
  onCancel?: () => void;
  initialData?: Worker;
}

export function WorkerForm({ onSubmit, onCancel, initialData }: WorkerFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    workerId: initialData?.workerId || '',
    nationality: initialData?.nationality || '',
    organization: initialData?.organization || '',
    phoneNumber: initialData?.phoneNumber || '',
    dateOfIssue: initialData?.dateOfIssue || '',
    iqamaExpiryDate: initialData?.iqamaExpiryDate || '',
    insuranceExpiryDate: initialData?.insuranceExpiryDate || '',
    kafalatAmount: initialData?.kafalatAmount || 500,
    kafalatStartDate: initialData?.kafalatStartDate || new Date().toISOString().split('T')[0],
    kafalatPayments: initialData?.kafalatPayments || []
  });

  const { data: organizations } = storageService.loadOrganizations();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const workerData: Worker = {
      ...formData,
      id: initialData?.id || Date.now().toString(),
      dateOfEntry: initialData?.dateOfEntry || new Date().toISOString()
    };
    onSubmit(workerData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const handleKafalatChange = (selectedMonths: string[], exemptMonths: string[]) => {
    const payments = selectedMonths.map(month => ({
      month,
      paid: true,
      amount: formData.kafalatAmount,
      date: new Date().toISOString(),
      isExempt: exemptMonths.includes(month)
    }));
    setFormData(prev => ({ ...prev, kafalatPayments: payments }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Worker ID</label>
          <input
            type="text"
            name="workerId"
            value={formData.workerId}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Organization</label>
          <select
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Organization</option>
            {organizations.map(org => (
              <option key={org.id} value={org.name}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nationality</label>
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Issue</label>
          <input
            type="date"
            name="dateOfIssue"
            value={formData.dateOfIssue}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Iqama Expiry Date</label>
          <input
            type="date"
            name="iqamaExpiryDate"
            value={formData.iqamaExpiryDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Insurance Expiry Date</label>
          <input
            type="date"
            name="insuranceExpiryDate"
            value={formData.insuranceExpiryDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Kafalat Amount (SAR)</label>
          <input
            type="number"
            name="kafalatAmount"
            value={formData.kafalatAmount}
            onChange={handleChange}
            required
            min="0"
            step="100"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Kafalat Start Date</label>
          <input
            type="date"
            name="kafalatStartDate"
            value={formData.kafalatStartDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <KafalatMonthSelector
        selectedMonths={formData.kafalatPayments.map(p => p.month)}
        exemptMonths={formData.kafalatPayments.filter(p => p.isExempt).map(p => p.month)}
        onMonthsChange={handleKafalatChange}
        startDate={new Date(formData.kafalatStartDate)}
        monthlyAmount={formData.kafalatAmount}
      />

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {initialData ? 'Update Worker' : 'Add Worker'}
        </button>
      </div>
    </form>
  );
}