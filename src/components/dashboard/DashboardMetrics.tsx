import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  DollarSign,
  Calendar,
  FileText,
  TrendingUp,
  Clock
} from 'lucide-react';
import type { DashboardMetrics, Worker, Organization } from '../../types';

interface DashboardMetricsProps {
  metrics: DashboardMetrics;
  workers: Worker[];
  organizations: Organization[];
}

export function DashboardMetrics({ metrics, workers, organizations }: DashboardMetricsProps) {
  const { t } = useTranslation();

  const cards = [
    {
      title: t('dashboard.totalWorkers'),
      value: metrics.totalWorkers,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: t('dashboard.activeServices'),
      value: metrics.activeServices,
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      title: t('dashboard.totalIncome'),
      value: new Intl.NumberFormat('en-SA', {
        style: 'currency',
        currency: 'SAR'
      }).format(metrics.totalIncome),
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: t('dashboard.overduePayments'),
      value: metrics.overduePayments,
      icon: Calendar,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-lg shadow-sm p-6 space-y-2"
            >
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
              </div>
              <p className="text-2xl font-semibold">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-medium">{t('dashboard.recentActivity')}</h3>
        </div>
        <div className="space-y-4">
          {metrics.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
              <div>
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}