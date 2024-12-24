import type { Worker, Organization, FinancialTransaction, Visa } from '../types';

interface StorageService {
  // Worker methods
  loadWorkers: (page?: number) => { data: Worker[]; total: number; pages: number };
  saveWorker: (worker: Worker) => Worker;
  updateWorker: (worker: Worker) => Worker;
  deleteWorker: (id: string) => void;

  // Organization methods
  loadOrganizations: (page?: number) => { data: Organization[]; total: number; pages: number };
  saveOrganization: (organization: Organization) => Organization;
  updateOrganization: (organization: Organization) => Organization;
  deleteOrganization: (id: string) => void;

  // Transaction methods
  loadTransactions: () => { data: FinancialTransaction[]; total: number; pages: number };
  saveTransaction: (transaction: FinancialTransaction) => FinancialTransaction;

  // Visa methods
  loadVisas: () => { data: Visa[] };
  addVisa: (visa: Partial<Visa>) => Promise<Visa>;
  updateVisa: (id: string, visa: Partial<Visa>) => Promise<Visa>;
  deleteVisa: (id: string) => Promise<void>;
}

export const storageService: StorageService = {
  // Worker methods
  loadWorkers: (page = 1) => {
    const PAGE_SIZE = 10;
    try {
      const workers = localStorage.getItem('workers');
      const data = workers ? JSON.parse(workers) : [];
      const start = (page - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      
      return {
        data: data.slice(start, end),
        total: data.length,
        pages: Math.ceil(data.length / PAGE_SIZE)
      };
    } catch (error) {
      console.error('Error loading workers:', error);
      return { data: [], total: 0, pages: 0 };
    }
  },

  saveWorker: (worker: Worker) => {
    try {
      const workers = storageService.loadWorkers().data;
      workers.push(worker);
      localStorage.setItem('workers', JSON.stringify(workers));
      return worker;
    } catch (error) {
      console.error('Error saving worker:', error);
      throw error;
    }
  },

  updateWorker: (worker: Worker) => {
    try {
      const workers = storageService.loadWorkers().data;
      const index = workers.findIndex(w => w.id === worker.id);
      if (index !== -1) {
        workers[index] = worker;
        localStorage.setItem('workers', JSON.stringify(workers));
      }
      return worker;
    } catch (error) {
      console.error('Error updating worker:', error);
      throw error;
    }
  },

  deleteWorker: (id: string) => {
    try {
      const workers = storageService.loadWorkers().data;
      const filteredWorkers = workers.filter(w => w.id !== id);
      localStorage.setItem('workers', JSON.stringify(filteredWorkers));
    } catch (error) {
      console.error('Error deleting worker:', error);
      throw error;
    }
  },

  // Organization methods
  loadOrganizations: (page = 1) => {
    const PAGE_SIZE = 10;
    try {
      const organizations = localStorage.getItem('organizations');
      const data = organizations ? JSON.parse(organizations) : [];
      const start = (page - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      
      return {
        data: data.slice(start, end),
        total: data.length,
        pages: Math.ceil(data.length / PAGE_SIZE)
      };
    } catch (error) {
      console.error('Error loading organizations:', error);
      return { data: [], total: 0, pages: 0 };
    }
  },

  saveOrganization: (organization: Organization) => {
    try {
      const organizations = storageService.loadOrganizations().data;
      organizations.push(organization);
      localStorage.setItem('organizations', JSON.stringify(organizations));
      return organization;
    } catch (error) {
      console.error('Error saving organization:', error);
      throw error;
    }
  },

  updateOrganization: (organization: Organization) => {
    try {
      const organizations = storageService.loadOrganizations().data;
      const index = organizations.findIndex(o => o.id === organization.id);
      if (index !== -1) {
        organizations[index] = organization;
        localStorage.setItem('organizations', JSON.stringify(organizations));
      }
      return organization;
    } catch (error) {
      console.error('Error updating organization:', error);
      throw error;
    }
  },

  deleteOrganization: (id: string) => {
    try {
      const organizations = storageService.loadOrganizations().data;
      const filteredOrganizations = organizations.filter(o => o.id !== id);
      localStorage.setItem('organizations', JSON.stringify(filteredOrganizations));
    } catch (error) {
      console.error('Error deleting organization:', error);
      throw error;
    }
  },

  // Transaction methods
  loadTransactions: () => {
    try {
      const transactions = localStorage.getItem('transactions');
      const data = transactions ? JSON.parse(transactions) : [];
      return {
        data,
        total: data.length,
        pages: Math.ceil(data.length / 10)
      };
    } catch (error) {
      console.error('Error loading transactions:', error);
      return { data: [], total: 0, pages: 0 };
    }
  },

  saveTransaction: (transaction: FinancialTransaction) => {
    try {
      const transactions = storageService.loadTransactions().data;
      transactions.push(transaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));
      return transaction;
    } catch (error) {
      console.error('Error saving transaction:', error);
      throw error;
    }
  },

  // Visa methods (keeping our new implementation)
  loadVisas: () => {
    try {
      const visas = localStorage.getItem('visas');
      return {
        data: visas ? JSON.parse(visas) : []
      };
    } catch (error) {
      console.error('Error loading visas:', error);
      return { data: [] };
    }
  },

  addVisa: async (visa: Partial<Visa>) => {
    try {
      const visas = storageService.loadVisas().data;
      const newVisa = {
        ...visa,
        id: crypto.randomUUID(),
        status: 'available',
        dateCreated: new Date().toISOString()
      };
      visas.push(newVisa);
      localStorage.setItem('visas', JSON.stringify(visas));
      return newVisa as Visa;
    } catch (error) {
      console.error('Error adding visa:', error);
      throw error;
    }
  },

  updateVisa: async (id: string, visa: Partial<Visa>) => {
    try {
      const visas = storageService.loadVisas().data;
      const index = visas.findIndex((v: Visa) => v.id === id);
      if (index === -1) throw new Error('Visa not found');
      
      visas[index] = {
        ...visas[index],
        ...visa,
        dateModified: new Date().toISOString()
      };
      
      localStorage.setItem('visas', JSON.stringify(visas));
      return visas[index] as Visa;
    } catch (error) {
      console.error('Error updating visa:', error);
      throw error;
    }
  },

  deleteVisa: async (id: string) => {
    try {
      const visas = storageService.loadVisas().data;
      const filteredVisas = visas.filter((v: Visa) => v.id !== id);
      localStorage.setItem('visas', JSON.stringify(filteredVisas));
    } catch (error) {
      console.error('Error deleting visa:', error);
      throw error;
    }
  }
};

// Initialize storage if needed
if (!localStorage.getItem('visas')) {
  localStorage.setItem('visas', JSON.stringify([]));
}
if (!localStorage.getItem('workers')) {
  localStorage.setItem('workers', JSON.stringify([]));
}
if (!localStorage.getItem('organizations')) {
  localStorage.setItem('organizations', JSON.stringify([]));
}
if (!localStorage.getItem('transactions')) {
  localStorage.setItem('transactions', JSON.stringify([]));
}