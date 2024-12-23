import type { Worker, Organization, FinancialTransaction, Visa } from '../types';

class StorageService {
  private readonly PAGE_SIZE = 10;

  private getItem<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      return [];
    }
  }

  private setItem<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw new Error(`Failed to save ${key}`);
    }
  }

  // Workers with pagination
  saveWorker(worker: Worker): Worker {
    const workers = this.getItem<Worker>('workers');
    workers.push(worker);
    this.setItem('workers', workers);
    this.refreshData();
    return worker;
  }

  loadWorkers(page = 1): { data: Worker[]; total: number; pages: number } {
    const workers = this.getItem<Worker>('workers');
    const start = (page - 1) * this.PAGE_SIZE;
    const end = start + this.PAGE_SIZE;
    
    return {
      data: workers.slice(start, end),
      total: workers.length,
      pages: Math.ceil(workers.length / this.PAGE_SIZE)
    };
  }

  // Organizations with pagination
  saveOrganization(organization: Organization): Organization {
    const organizations = this.getItem<Organization>('organizations');
    organizations.push(organization);
    this.setItem('organizations', organizations);
    return organization;
  }

  loadOrganizations(page = 1): { data: Organization[]; total: number; pages: number } {
    const organizations = this.getItem<Organization>('organizations');
    const workers = this.getItem<Worker>('workers');
    
    // Add worker count to each organization
    const orgsWithCount = organizations.map(org => ({
      ...org,
      workerCount: workers.filter(w => w.organization === org.name).length
    }));
    
    const start = (page - 1) * this.PAGE_SIZE;
    const end = start + this.PAGE_SIZE;
    
    return {
      data: orgsWithCount.slice(start, end),
      total: organizations.length,
      pages: Math.ceil(organizations.length / this.PAGE_SIZE)
    };
  }

  // Data cleanup methods
  cleanupOldWorkers(monthsOld = 12): void {
    const workers = this.getItem<Worker>('workers');
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - monthsOld);

    const activeWorkers = workers.filter(worker => 
      new Date(worker.dateOfEntry) > cutoffDate
    );
    this.setItem('workers', activeWorkers);
  }

  cleanupExpiredOrganizations(): void {
    const organizations = this.getItem<Organization>('organizations');
    const today = new Date();

    const activeOrganizations = organizations.filter(org => 
      new Date(org.expiryDate) > today
    );
    this.setItem('organizations', activeOrganizations);
  }

  // Storage management
  getStorageUsage(): { used: number; total: number; percentage: number } {
    const total = 5 * 1024 * 1024; // 5MB in bytes
    const used = new Blob([JSON.stringify(localStorage)]).size;
    
    return {
      used,
      total,
      percentage: (used / total) * 100
    };
  }

  compressData(): void {
    // Basic compression by removing unnecessary whitespace
    Object.keys(localStorage).forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        localStorage.setItem(key, JSON.stringify(JSON.parse(value)));
      }
    });
  }

  updateWorker(worker: Worker): Worker {
    const workers = this.getItem<Worker>('workers');
    const index = workers.findIndex(w => w.id === worker.id);
    if (index !== -1) {
      workers[index] = worker;
      this.setItem('workers', workers);
    }
    return worker;
  }

  deleteWorker(workerId: string): void {
    const workers = this.getItem<Worker>('workers');
    const filteredWorkers = workers.filter(w => w.id !== workerId);
    this.setItem('workers', filteredWorkers);
  }

  updateOrganization(organization: Organization): Organization {
    const organizations = this.getItem<Organization>('organizations');
    const index = organizations.findIndex(o => o.id === organization.id);
    if (index !== -1) {
      organizations[index] = organization;
      this.setItem('organizations', organizations);
    }
    return organization;
  }

  deleteOrganization(orgId: string): void {
    const organizations = this.getItem<Organization>('organizations');
    const filteredOrganizations = organizations.filter(o => o.id !== orgId);
    this.setItem('organizations', filteredOrganizations);
  }

  private refreshData(): void {
    // Force a refresh of the data
    const event = new CustomEvent('storage-updated');
    window.dispatchEvent(event);
  }

  loadTransactions(): { data: FinancialTransaction[]; total: number; pages: number } {
    const transactions = this.getItem<FinancialTransaction>('transactions');
    return {
      data: transactions,
      total: transactions.length,
      pages: Math.ceil(transactions.length / this.PAGE_SIZE)
    };
  }

  saveTransaction(transaction: FinancialTransaction): FinancialTransaction {
    const transactions = this.getItem<FinancialTransaction>('transactions');
    transactions.push(transaction);
    this.setItem('transactions', transactions);
    return transaction;
  }

  loadVisas(page = 1): { data: Visa[]; total: number; pages: number } {
    const visas = this.getItem<Visa>('visas');
    const start = (page - 1) * this.PAGE_SIZE;
    const end = start + this.PAGE_SIZE;
    
    return {
      data: visas.slice(start, end),
      total: visas.length,
      pages: Math.ceil(visas.length / this.PAGE_SIZE)
    };
  }

  saveVisa(visa: Visa): Visa {
    const visas = this.getItem<Visa>('visas');
    visas.push(visa);
    this.setItem('visas', visas);
    return visa;
  }

  updateVisa(visa: Visa): Visa {
    const visas = this.getItem<Visa>('visas');
    const index = visas.findIndex(v => v.id === visa.id);
    if (index !== -1) {
      visas[index] = visa;
      this.setItem('visas', visas);
    }
    return visa;
  }

  deleteVisa(visaId: string): void {
    const visas = this.getItem<Visa>('visas');
    const filteredVisas = visas.filter(v => v.id !== visaId);
    this.setItem('visas', filteredVisas);
  }
}

export const storageService = new StorageService();