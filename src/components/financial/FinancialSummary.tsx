import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, RefreshCw, DollarSign } from 'lucide-react';
import type { FinancialTransaction } from '../../types';

interface FinancialSummaryProps {
  transactions?: FinancialTransaction[];
}

export function FinancialSummary({ transactions = [] }: FinancialSummaryProps) {
  const summary = {
    totalIncome: 0,
    totalExpenses: 0,
    totalRefunds: 0,
    netAmount: 0,
    pendingTransactions: 0
  };

  // Calculate summary from transactions
  transactions.forEach(transaction => {
    const amount = Number(transaction.amount) || 0;
    
    if (transaction.type === 'income') {
      summary.totalIncome += amount;
    } else if (transaction.type === 'expense') {
      summary.totalExpenses += amount;
    } else if (transaction.type === 'refund') {
      summary.totalRefunds += amount;
    }

    if (transaction.status === 'pending') {
      summary.pendingTransactions += 1;
    }
  });

  summary.netAmount = summary.totalIncome - summary.totalExpenses + summary.totalRefunds;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Total Income</p>
            <h3 className="text-2xl font-bold text-green-600">${summary.totalIncome.toLocaleString()}</h3>
          </div>
          <TrendingUp className="h-8 w-8 text-green-500" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Total Expenses</p>
            <h3 className="text-2xl font-bold text-red-600">${summary.totalExpenses.toLocaleString()}</h3>
          </div>
          <TrendingDown className="h-8 w-8 text-red-500" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Net Amount</p>
            <h3 className={`text-2xl font-bold ${summary.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(summary.netAmount).toLocaleString()}
            </h3>
          </div>
          <DollarSign className={`h-8 w-8 ${summary.netAmount >= 0 ? 'text-green-500' : 'text-red-500'}`} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Pending Transactions</p>
            <h3 className="text-2xl font-bold text-orange-600">{summary.pendingTransactions}</h3>
          </div>
          <RefreshCw className="h-8 w-8 text-orange-500" />
        </div>
      </div>
    </div>
  );
}