import React from 'react';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { VisaInventory } from '../../types';

interface VisaStatsProps {
  stats: VisaInventory;
}

export function VisaStats({ stats }: VisaStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Visas</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Available</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.available}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Reserved</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.reserved}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <XCircle className="h-6 w-6 text-gray-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Used</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.used}</p>
          </div>
        </div>
      </div>
    </div>
  );
}