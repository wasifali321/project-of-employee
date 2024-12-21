import { differenceInMonths } from 'date-fns';
import type { Worker, KafalatMetrics } from '../types';

export function calculateKafalatMetrics(workers: Worker[]): KafalatMetrics {
  const currentDate = new Date();
  
  return workers.reduce((metrics, worker) => {
    const startDate = new Date(worker.dateOfEntry);
    const totalMonths = differenceInMonths(currentDate, startDate) + 1;
    const paidMonths = worker.kafalatPayments?.length || 0;
    const unpaidMonths = totalMonths - paidMonths;
    const monthlyAmount = worker.kafalatAmount || 0;

    const totalCollected = worker.kafalatPayments.reduce((sum, payment) => 
      sum + payment.amount, 0);
    const pendingAmount = unpaidMonths * monthlyAmount;

    return {
      totalCollected: metrics.totalCollected + totalCollected,
      pendingAmount: metrics.pendingAmount + pendingAmount,
      workersUpToDate: metrics.workersUpToDate + (unpaidMonths === 0 ? 1 : 0),
      workersOverdue: metrics.workersOverdue + (unpaidMonths > 0 ? 1 : 0),
    };
  }, {
    totalCollected: 0,
    pendingAmount: 0,
    workersUpToDate: 0,
    workersOverdue: 0,
  });
}

export function getKafalatStatus(worker: Worker): {
  status: 'upToDate' | 'pending' | 'overdue';
  unpaidMonths: number;
  overdueAmount: number;
} {
  const currentDate = new Date();
  const startDate = new Date(worker.dateOfEntry);
  const totalMonths = differenceInMonths(currentDate, startDate) + 1;
  const paidMonths = worker.kafalatPayments?.length || 0;
  const unpaidMonths = totalMonths - paidMonths;
  const overdueAmount = unpaidMonths * (worker.kafalatAmount || 0);

  return {
    status: unpaidMonths === 0 ? 'upToDate' : unpaidMonths >= 3 ? 'overdue' : 'pending',
    unpaidMonths,
    overdueAmount,
  };
}