export type Role = 'admin' | 'manager' | 'user';

export interface KafalatMetrics {
  totalCollected: number;
  pendingAmount: number;
  workersUpToDate: number;
  workersOverdue: number;
}

export interface KafalatPayment {
  month: string;
  paid: boolean;
  amount: number;
  date: string;
  isExempt?: boolean;
  reference?: string;
  notes?: string;
}

export interface Worker {
  id: string;
  name: string;
  workerId?: string;
  nationality?: string;
  organization?: string;
  phoneNumber?: string;
  dateOfIssue?: string;
  iqamaExpiryDate?: string;
  insuranceExpiryDate?: string;
  kafalatAmount?: number;
  kafalatStartDate?: string;
  kafalatPayments?: any[];
  dateOfEntry?: string;
}

export interface Organization {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  contactPerson: string;
  crNumber: string;
  vatNumber: string;
  status: 'active' | 'inactive';
}

export interface VisaService {
  id: string;
  customerName: string;
  passportNumber: string;
  mobileNumber: string;
  organization: string;
  totalPrice: number;
  sellingPrice: number;
  remainingAmount: number;
  date: string;
  receiptNumber: string;
  status: 'available' | 'reserved' | 'used';
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: 'workers' | 'organizations' | 'services' | 'users';
  actions: Array<'create' | 'read' | 'update' | 'delete'>;
}

export interface RolePermissions {
  [key: string]: Permission[];
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  action: 'create' | 'update' | 'delete';
  module: string;
  entityId: string;
  entityType: string;
  description: string;
  changes: Array<{
    field: string;
    oldValue?: string;
    newValue?: string;
  }>;
  user: string;
  canUndo: boolean;
}

export interface Settings {
  companyName: string;
  companyLogo: string;
  language: string;
  currency: string;
  dateFormat: string;
  theme: string;
}

export interface Visa {
  id: string;
  visaNumber: string;
  borderNumber: string;
  profession: string;
  nationality: string;
  status: 'available' | 'reserved' | 'used';
  type: 'new' | 'transfer' | 'renewal';
  gender: 'male' | 'female';
  price: number;
  purchaseDate: string;
  expiryDate: string;
  notes?: string;
  dateCreated: string;
  dateModified?: string;
}

export interface VisaDocument {
  name: string;
  url: string;
  uploadDate: string;
}

export interface VisaInventory {
  total: number;
  available: number;
  reserved: number;
  used: number;
}

export type PaymentSource = 'worker' | 'company' | 'other';
export type PaymentCategory = 'salary' | 'visa' | 'iqama' | 'insurance' | 'other';

export interface FinancialTransaction {
  id: string;
  date: string;
  type: 'income' | 'expense' | 'refund';
  amount: number;
  description: string;
  category: string;
  paymentMethod: string;
  source: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  totalRefunds: number;
  netAmount: number;
  pendingTransactions: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'visa' | 'other';
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

export interface DashboardAlertsProps {
  workers: Worker[];
  visas: Visa[];
}

export interface FinancialSummaryProps {
  transactions: FinancialTransaction[];
}

export interface WorkerListProps {
  workers: Worker[];
  onEdit: (worker: Worker) => void;
  onDelete: (id: string) => void;
  onUpdateWorker: (worker: Worker) => void;
  onSearch: (term: string, filters: any) => void;
}

export interface VisaServicePanelProps {
  services: Service[];
  organizations: Organization[];
}

export interface DashboardMetrics {
  totalWorkers: number;
  activeServices: number;
  totalIncome: number;
  overduePayments: number;
  recentActivity: {
    type: string;
    description: string;
    timestamp: string;
  }[];
}
