import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash } from 'lucide-react';

export interface Column {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date';
  required?: boolean;
  options?: { value: string; label: string }[];
}

interface ExcelTableProps {
  columns: Column[];
  onSubmit: (data: any[]) => void;
}

export function ExcelTable({ columns, onSubmit }: ExcelTableProps) {
  const { t } = useTranslation();
  const [data, setData] = useState<Record<string, any>[]>([{}]);

  const handleSubmit = () => {
    onSubmit(data.filter(row => Object.keys(row).length > 0));
  };

  const addRow = () => setData([...data, {}]);
  const removeRow = (index: number) => setData(data.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {col.label}
                  {col.required && <span className="text-red-500">*</span>}
                </th>
              ))}
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map(col => (
                  <td key={col.key} className="px-6 py-4">
                    <input
                      type={col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : 'text'}
                      value={row[col.key] || ''}
                      onChange={e => {
                        const newData = [...data];
                        newData[rowIndex] = { ...row, [col.key]: e.target.value };
                        setData(newData);
                      }}
                      className="w-full border-gray-300 rounded-md"
                      required={col.required}
                    />
                  </td>
                ))}
                <td className="px-2">
                  <button onClick={() => removeRow(rowIndex)} className="text-red-600">
                    <Trash className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between">
        <button onClick={addRow} className="flex items-center text-blue-600">
          <Plus className="h-4 w-4 mr-1" />
          {t('common.addRow')}
        </button>
        <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
          {t('common.submit')}
        </button>
      </div>
    </div>
  );
} 