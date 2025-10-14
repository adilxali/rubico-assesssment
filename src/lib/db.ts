import localforage from 'localforage';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  billingAddress: Address;
  shippingAddress: Address;
  createdAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

const customersStore = localforage.createInstance({
  name: 'rubico-app',
  storeName: 'customers'
});

const invoicesStore = localforage.createInstance({
  name: 'rubico-app',
  storeName: 'invoices'
});

export const db = {
  customers: {
    async getAll(): Promise<Customer[]> {
      const customers: Customer[] = [];
      await customersStore.iterate<Customer, void>((value) => {
        customers.push(value);
      });
      return customers.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },

    async getById(id: string): Promise<Customer | null> {
      return await customersStore.getItem<Customer>(id);
    },

    async getByEmail(email: string): Promise<Customer | null> {
      const customers = await this.getAll();
      return customers.find(c => c.email.toLowerCase() === email.toLowerCase()) || null;
    },

    async create(customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
      const newCustomer: Customer = {
        ...customer,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };
      await customersStore.setItem(newCustomer.id, newCustomer);
      return newCustomer;
    },

    async update(id: string, customer: Partial<Customer>): Promise<Customer | null> {
      const existing = await this.getById(id);
      if (!existing) return null;

      const updated = { ...existing, ...customer };
      await customersStore.setItem(id, updated);
      return updated;
    },

    async delete(id: string): Promise<void> {
      await customersStore.removeItem(id);
    }
  },

  invoices: {
    async getAll(): Promise<Invoice[]> {
      const invoices: Invoice[] = [];
      await invoicesStore.iterate<Invoice, void>((value) => {
        invoices.push(value);
      });
      return invoices.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },

    async getById(id: string): Promise<Invoice | null> {
      return await invoicesStore.getItem<Invoice>(id);
    },

    async getByCustomerId(customerId: string): Promise<Invoice[]> {
      const invoices = await this.getAll();
      return invoices.filter(inv => inv.customerId === customerId);
    },

    async create(invoice: Omit<Invoice, 'id' | 'createdAt'>): Promise<Invoice> {
      const newInvoice: Invoice = {
        ...invoice,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };
      await invoicesStore.setItem(newInvoice.id, newInvoice);
      return newInvoice;
    },

    async update(id: string, invoice: Partial<Invoice>): Promise<Invoice | null> {
      const existing = await this.getById(id);
      if (!existing) return null;

      const updated = { ...existing, ...invoice };
      await invoicesStore.setItem(id, updated);
      return updated;
    },

    async delete(id: string): Promise<void> {
      await invoicesStore.removeItem(id);
    }
  }
};
