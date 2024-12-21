import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FinancialSummary } from './FinancialSummary';
import { TransactionForm } from './TransactionForm';
import { TransactionList } from './TransactionList';
import { DollarSign, FileText, CreditCard } from 'lucide-react';
import type { FinancialTransaction } from '../../types';

export function FinancialPanel() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('transactions');
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const handleAddTransaction = (transaction: Omit<FinancialTransaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleUpdateTransaction = (transaction: FinancialTransaction) => {
    setTransactions(prev => prev.map(t => t.id === transaction.id ? transaction : t));
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesDate = !dateRange.start || (
      new Date(t.date) >= new Date(dateRange.start) &&
      new Date(t.date) <= new Date(dateRange.end || dateRange.start)
    );
    return matchesSearch && matchesType && matchesDate;
  });

  const tabs = [
    { id: 'transactions', label: 'Transactions', icon: DollarSign },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'payments', label: 'Payments', icon: CreditCard }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <FinancialSummary transactions={transactions} />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 px-4 py-4 text-center border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                <tab.icon className="h-5 w-5 mx-auto mb-1" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div className="mb-4 flex gap-4">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="border rounded px-3 py-2"
                />
                <select 
                  value={filterType} 
                  onChange={e => setFilterType(e.target.value as any)}
                  className="border rounded px-3 py-2"
                >
                  <option value="all">All Transactions</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="border rounded px-3 py-2"
                />
              </div>

              <TransactionForm onSubmit={handleAddTransaction} />
              
              <TransactionList 
                transactions={filteredTransactions}
                onUpdate={handleUpdateTransaction}
                onDelete={handleDeleteTransaction}
              />
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              {/* Reports content */}
            </div>
          )}

          {activeTab === 'payments' && (
            <div>
              {/* Payments content */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}