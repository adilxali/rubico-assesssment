import { create } from 'zustand';
import { Customer, Invoice, db } from '../lib/db';

interface AppState {
  customers: Customer[];
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;

  loadCustomers: () => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Promise<Customer>;
  deleteCustomer: (id: string) => Promise<void>;

  loadInvoices: () => Promise<void>;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => Promise<Invoice>;
  deleteInvoice: (id: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  customers: [],
  invoices: [],
  isLoading: false,
  error: null,

  loadCustomers: async () => {
    set({ isLoading: true, error: null });
    try {
      const customers = await db.customers.getAll();
      set({ customers, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load customers', isLoading: false });
    }
  },

  addCustomer: async (customerData) => {
    set({ isLoading: true, error: null });
    try {
      const customer = await db.customers.create(customerData);
      set(state => ({
        customers: [customer, ...state.customers],
        isLoading: false
      }));
      return customer;
    } catch (error) {
      set({ error: 'Failed to create customer', isLoading: false });
      throw error;
    }
  },



  deleteCustomer: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await db.customers.delete(id);
      set(state => ({
        customers: state.customers.filter(c => c.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete customer', isLoading: false });
    }
  },

  loadInvoices: async () => {
    set({ isLoading: true, error: null });
    try {
      const invoices = await db.invoices.getAll();
      set({ invoices, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load invoices', isLoading: false });
    }
  },

  addInvoice: async (invoiceData) => {
    set({ isLoading: true, error: null });
    try {
      const invoice = await db.invoices.create(invoiceData);
      set(state => ({
        invoices: [invoice, ...state.invoices],
        isLoading: false
      }));
      return invoice;
    } catch (error) {
      set({ error: 'Failed to create invoice', isLoading: false });
      throw error;
    }
  },

  deleteInvoice: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await db.invoices.delete(id);
      set(state => ({
        invoices: state.invoices.filter(inv => inv.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete invoice', isLoading: false });
    }
  }
}));
