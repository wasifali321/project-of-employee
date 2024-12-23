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
  workerId: string;
  nationality: string;
  organization: string;
  phoneNumber: string;
  dateOfIssue: string;
  iqamaExpiryDate: string;
  insuranceExpiryDate?: string;
  dateOfEntry: string;
  kafalatAmount: number;
  kafalatStartDate: string;
  kafalatPayments: KafalatPayment[];
}

export interface Organization {
  id: string;
  name: string;
  commercialNumber: string;
  unifiedNumber: string;
  qiwaNumber: string;
  gosiNumber: string;
  openingDate: string;
  expiryDate: string;
  workerCount?: number;
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
  general: {
    companyName: string;
    companyLogo: string;
    defaultLanguage: string;
    timeZone: string;
    dateFormat: string;
    currency: string;
  };
  notifications: {
    emailNotifications: boolean;
    documentExpiryAlert: boolean;
    kafalaDueAlert: boolean;
    alertDays: number;
    emailRecipients: string;
  };
  security: {
    requireTwoFactor: boolean;
    passwordExpiry: number;
    sessionTimeout: number;
    allowedIPs: string[];
    loginAttempts: number;
  };
  system: {
    dataRetentionPeriod: number;
    backupFrequency: string;
    maxFileSize: number;
    allowedFileTypes: string;
    enableAuditLog: boolean;
  };
}

export interface Visa {
  id: string;
  visaNumber: string;
  borderNumber: string;
  quantity: number;
  nationality: string;
  profession: string;
  organizationId: string;
  agencyName: string;
  status: 'available' | 'reserved' | 'used';
  type: 'new' | 'transfer' | 'renewal';
  unifiedNumber?: string;
  crNumber?: string;
  price: number;
  purchaseDate: string;
  expiryDate: string;
  notes?: string;
  assignedTo?: string;
  documents?: VisaDocument[];
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
  amount: number;
  type: 'income' | 'expense' | 'refund';
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
  description: string;
  category: PaymentCategory;
  reference?: string;
  paymentMethod: 'cash' | 'bank' | 'card';
  source: PaymentSource;
  workerId?: string;
  visaId?: string;
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
