import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from '../../contexts/HistoryContext';
import { RotateCcw, RotateCw } from 'lucide-react';

export function HistoryPanel() {
  const { t } = useTranslation();
  const { history, undo, redo, canUndo, canRedo } = useHistory();
  const [selectedModule, setSelectedModule] = useState<string>('all');

  const filteredActions = history.actions.filter(action => 
    selectedModule === 'all' || action.module === selectedModule
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{t('settings.history')}</h2>
        <div className="flex space-x-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-2 rounded ${
              canUndo ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-2 rounded ${
              canRedo ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}
          >
            <RotateCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="all">{t('common.all')}</option>
            <option value="visa">{t('navigation.visaInventory')}</option>
            <option value="worker">{t('navigation.workers')}</option>
            <option value="organization">{t('navigation.organizations')}</option>
            <option value="financial">{t('navigation.financial')}</option>
          </select>
        </div>

        <div className="divide-y">
          {filteredActions.map((action) => (
            <div key={action.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between">
                <div>
                  <span className="font-medium">{action.description}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    {new Date(action.timestamp).toLocaleString()}
                  </span>
                </div>
                {action.canUndo && (
                  <button
                    onClick={() => undo()}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {t('common.undo')}
                  </button>
                )}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {action.changes.map((change, index) => (
                  <div key={index}>
                    <span className="font-medium">{change.field}:</span>{' '}
                    {change.oldValue} → {change.newValue}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 