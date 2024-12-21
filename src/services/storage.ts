import type { Worker, Organization, Service } from '../types';

class StorageService {
  private readonly PAGE_SIZE = 10;

  private getItem<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setItem<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
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
}

export const storageService = new StorageService();