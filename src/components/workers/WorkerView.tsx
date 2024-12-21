import React from 'react';
import { X } from 'lucide-react';
import type { Worker } from '../../types';
import { format } from 'date-fns';

interface WorkerViewProps {
  worker: Worker;
  onClose: () => void;
}

export function WorkerView({ worker, onClose }: WorkerViewProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Worker Details</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Personal Information</h3>
          <div className="mt-2 space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Name</label>
              <p className="mt-1 text-sm font-medium text-gray-900">{worker.name}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-700">Worker ID</label>
              <p className="mt-1 text-sm font-medium text-gray-900">{worker.workerId}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-700">Nationality</label>
              <p className="mt-1 text-sm font-medium text-gray-900">{worker.nationality}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-700">Phone Number</label>
              <p className="mt-1 text-sm font-medium text-gray-900">{worker.phoneNumber}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Document Information</h3>
          <div className="mt-2 space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Organization</label>
              <p className="mt-1 text-sm font-medium text-gray-900">{worker.organization}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-700">Date of Issue</label>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {format(new Date(worker.dateOfIssue), 'PP')}
              </p>
            </div>
            <div>
              <label className="block text-sm text-gray-700">Iqama Expiry</label>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {format(new Date(worker.iqamaExpiryDate), 'PP')}
              </p>
            </div>
            <div>
              <label className="block text-sm text-gray-700">Insurance Expiry</label>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {worker.insuranceExpiryDate ? format(new Date(worker.insuranceExpiryDate), 'PP') : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-500">Kafalat Information</h3>
        <div className="mt-2 space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-700">Monthly Amount</label>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {worker.kafalatAmount} SAR
              </p>
            </div>
            <div>
              <label className="block text-sm text-gray-700">Start Date</label>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {format(new Date(worker.kafalatStartDate), 'PP')}
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-700 mb-2">Payment History</label>
            <div className="max-h-40 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Month</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Amount</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {worker.kafalatPayments.map((payment, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 text-sm text-gray-500">{payment.month}</td>
                      <td className="px-3 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {payment.paid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-500">{payment.amount} SAR</td>
                      <td className="px-3 py-2 text-sm text-gray-500">
                        {format(new Date(payment.date), 'PP')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 