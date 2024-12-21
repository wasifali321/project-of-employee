export interface FinancialTransaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'pending' | 'completed';
  date: string;
  description?: string;
}