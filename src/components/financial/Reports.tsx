import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { storageService } from '../../services/storage';
import type { FinancialTransaction } from '../../types';
import { format, isWithinInterval, parseISO } from 'date-fns';

export function FinancialReports() {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const transactions = storageService.loadTransactions();

  const filteredTransactions = useMemo(() => {
    if (!dateRange.start || !dateRange.end) return transactions;
    
    return transactions.filter(t => {
      const date = parseISO(t.date);
      return isWithinInterval(date, {
        start: parseISO(dateRange.start),
        end: parseISO(dateRange.end)
      });
    });
  }, [transactions, dateRange]);

  const monthlyData = useMemo(() => {
    const report = filteredTransactions.reduce((acc, t) => {
      const month = format(parseISO(t.date), 'MMM yyyy');
      acc[month] = acc[month] || { income: 0, expenses: 0, refunds: 0 };
      if (t.type === 'income') acc[month].income += t.amount;
      if (t.type === 'expense') acc[month].expenses += t.amount;
      if (t.type === 'refund') acc[month].refunds += t.amount;
      return acc;
    }, {} as Record<string, { income: number; expenses: number; refunds: number }>);
    
    return Object.entries(report).map(([month, data]) => ({
      month,
      ...data
    }));
  }, [filteredTransactions]);

  const refundAmount = transactions
    .filter(t => t.type === 'refund')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-4">
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

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">{t('financial.monthlyOverview')}</h3>
        <BarChart width={800} height={400} data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#10B981" name={t('financial.income')} />
          <Bar dataKey="expenses" fill="#EF4444" name={t('financial.expenses')} />
          <Bar dataKey="refunds" fill="#F59E0B" name={t('financial.refunds')} />
        </BarChart>
      </div>
    </div>
  );
} 