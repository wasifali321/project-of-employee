import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { Organization } from '../../types';

interface BulkOrganizationEntryProps {
  onSubmit: (organizations: Omit<Organization, 'id'>[]) => void;
  onCancel: () => void;
}

export function BulkOrganizationEntry({ onSubmit, onCancel }: BulkOrganizationEntryProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFile(file);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      setPreview(data);
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview.length) return;

    const organizations = preview.map(row => ({
      name: row.name,
      commercialNumber: row.commercialNumber,
      unifiedNumber: row.unifiedNumber,
      qiwaNumber: row.qiwaNumber,
      gosiNumber: row.gosiNumber,
      openingDate: row.openingDate,
      expiryDate: row.expiryDate
    }));

    onSubmit(organizations);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Bulk Organization Upload</h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload className="h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              Excel files only (.xlsx, .xls)
            </p>
          </label>
        </div>

        {preview.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Preview</h3>
            <div className="max-h-60 overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(preview[0]).map(key => (
                      <th key={key} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {preview.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row).map((value: any, i) => (
                        <td key={i} className="px-3 py-2 text-sm text-gray-500">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!preview.length}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Upload Organizations
          </button>
        </div>
      </form>
    </div>
  );
}