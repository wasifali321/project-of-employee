import { useTranslation } from 'react-i18next';
import { Users, FileText, DollarSign } from 'lucide-react';
import type { Worker, Visa, FinancialTransaction } from '../../types';

interface DashboardStatsProps {
  data: {
    workers: Worker[];
    visas: Visa[];
    transactions: FinancialTransaction[];
  };
}

export function DashboardStats({ data }: DashboardStatsProps) {
  const { t } = useTranslation();

  const stats = [
    {
      name: t('dashboard.totalWorkers'),
      value: data.workers.length,
      icon: Users,
      change: '+4.75%',
      changeType: 'positive'
    },
    {
      name: t('dashboard.activeVisas'),
      value: data.visas.filter(v => v.status === 'active').length,
      icon: FileText,
      change: '-1.39%',
      changeType: 'negative'
    },
    {
      name: t('dashboard.monthlyRevenue'),
      value: calculateMonthlyRevenue(data.transactions),
      icon: DollarSign,
      change: '+10.2%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {stats.map((item) => (
        <div
          key={item.name}
          className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
        >
          <dt>
            <div className="absolute bg-blue-500 rounded-md p-3">
              <item.icon className="h-6 w-6 text-white" />
            </div>
            <p className="ml-16 text-sm font-medium text-gray-500 truncate">
              {item.name}
            </p>
          </dt>
          <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            <p
              className={`ml-2 flex items-baseline text-sm font-semibold ${
                item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {item.change}
            </p>
          </dd>
        </div>
      ))}
    </div>
  );
}

function calculateMonthlyRevenue(transactions: FinancialTransaction[]): string {
  const total = transactions
    .filter(t => {
      const date = new Date(t.date);
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, t) => {
      if (t.type === 'income') return sum + t.amount;
      if (t.type === 'expense') return sum - t.amount;
      return sum;
    }, 0);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'SAR'
  }).format(total);
} 
 