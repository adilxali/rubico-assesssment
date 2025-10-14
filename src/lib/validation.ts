import { z } from 'zod';
import { db } from './db';

const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required').regex(/^\d{6}(-\d{4})?$/, 'Invalid ZIP code format'),
  country: z.string().min(1, 'Country is required')
});

export const personalInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional()
}).refine(
  (data) => {
    if (data.email && data.phone && data.phone.length > 0) {
      return true;
    }
    if (data.email) {
      return true;
    }
    return false;
  },
  {
    message: 'Email is required',
    path: ['email']
  }
);

export const addressInfoSchema = z.object({
  billingAddress: addressSchema,
  shippingAddress: addressSchema,
  sameAsShipping: z.boolean().optional()
});

export const fullCustomerSchema = personalInfoSchema.merge(addressInfoSchema);

export const asyncEmailValidation = async (email: string, currentCustomerId?: string): Promise<boolean> => {
  const existingCustomer = await db.customers.getByEmail(email);
  if (!existingCustomer) return true;
  if (currentCustomerId && existingCustomer.id === currentCustomerId) return true;
  return false;
};

export const invoiceItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Item name is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  total: z.number()
});

export const invoiceSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  invoiceDate: z.string().min(1, 'Invoice date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  taxRate: z.number().min(0).max(100, 'Tax rate must be between 0 and 100')
}).refine(
  (data) => {
    if (data.invoiceDate && data.dueDate) {
      return new Date(data.dueDate) >= new Date(data.invoiceDate);
    }
    return true;
  },
  {
    message: 'Due date must be after invoice date',
    path: ['dueDate']
  }
);

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type AddressInfoFormData = z.infer<typeof addressInfoSchema>;
export type FullCustomerFormData = z.infer<typeof fullCustomerSchema>;
export type InvoiceFormData = z.infer<typeof invoiceSchema>;
export type InvoiceItemFormData = z.infer<typeof invoiceItemSchema>;
