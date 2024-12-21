import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { History, RotateCcw, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import type { HistoryEntry } from '../../../types';
import { format } from 'date-fns';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onUndo: (entry: HistoryEntry) => void;
}

export function HistoryPanel({ history, onUndo }: HistoryPanelProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedEntries(newExpanded);
  };

  const filteredHistory = history.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = selectedModule === 'all' || entry.module === selectedModule;
    const matchesAction = selectedAction === 'all' || entry.action === selectedAction;
    return matchesSearch && matchesModule && matchesAction;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'text-green-600 bg-green-100';
      case 'update': return 'text-blue-600 bg-blue-100';
      case 'delete': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <History className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">{t('settings.history.title')}</h3>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('settings.history.searchPlaceholder')}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">{t('settings.history.allModules')}</option>
              <option value="workers">{t('workers.title')}</option>
              <option value="organizations">{t('organizations.title')}</option>
              <option value="services">{t('services.title')}</option>
              <option value="financial">{t('financial.title')}</option>
              <option value="users">{t('users.title')}</option>
            </select>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">{t('settings.history.allActions')}</option>
              <option value="create">{t('settings.history.create')}</option>
              <option value="update">{t('settings.history.update')}</option>
              <option value="delete">{t('settings.history.delete')}</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredHistory.map((entry) => (
            <div key={entry.id} className="border rounded-lg overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                onClick={() => toggleExpand(entry.id)}
              >
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(entry.action)}`}>
                    {t(`settings.history.${entry.action}`)}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{entry.description}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(entry.timestamp), 'PPpp')} • {entry.user}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {entry.canUndo && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUndo(entry);
                      }}
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span className="text-sm">{t('settings.history.undo')}</span>
                    </button>
                  )}
                  {expandedEntries.has(entry.id) ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              {expandedEntries.has(entry.id) && entry.changes.length > 0 && (
                <div className="p-4 border-t bg-white">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          {t('settings.history.field')}
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          {t('settings.history.oldValue')}
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          {t('settings.history.newValue')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {entry.changes.map((change, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-gray-900">{change.field}</td>
                          <td className="px-4 py-2 text-sm text-red-600">{change.oldValue || '-'}</td>
                          <td className="px-4 py-2 text-sm text-green-600">{change.newValue || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}