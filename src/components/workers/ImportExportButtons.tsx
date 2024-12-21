import React, { useRef } from 'react';
import { Download, Upload, FileText } from 'lucide-react';
import { exportToExcel, exportToWord, importFromExcel } from '../../utils/exportUtils';
import type { Worker } from '../../types';

interface ImportExportButtonsProps {
  workers: Worker[];
  onImport: (workers: Omit<Worker, 'id'>[]) => void;
}

export function ImportExportButtons({ workers, onImport }: ImportExportButtonsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedWorkers = await importFromExcel(file);
      onImport(importedWorkers);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to import workers');
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx,.xls"
        className="hidden"
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Upload className="h-4 w-4 mr-2" />
        Import Excel
      </button>

      <button
        onClick={() => exportToExcel(workers)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Download className="h-4 w-4 mr-2" />
        Export Excel
      </button>

      <button
        onClick={() => exportToWord(workers)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <FileText className="h-4 w-4 mr-2" />
        Export Word
      </button>
    </div>
  );
}