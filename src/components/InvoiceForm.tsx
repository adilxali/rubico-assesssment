import { useState, useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, FileText } from 'lucide-react';
import { invoiceSchema, type InvoiceFormData } from '../lib/validation';
import { useStore } from '../store/useStore';
import { Customer } from '../lib/db';

interface InvoiceFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  preselectedCustomer?: Customer;
}

export default function InvoiceForm({ onSuccess, onCancel, preselectedCustomer }: InvoiceFormProps) {
  const customers = useStore(state => state.customers);
  const addInvoice = useStore(state => state.addInvoice);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(preselectedCustomer || null);

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customerId: preselectedCustomer?.id || '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [],
      taxRate: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  useEffect(() => {
    if (preselectedCustomer) {
      setSelectedCustomer(preselectedCustomer);
    }
  }, [preselectedCustomer]);

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    setSelectedCustomer(customer || null);
    form.setValue('customerId', customerId);
  };

  const addItem = () => {
    append({
      id: crypto.randomUUID(),
      name: '',
      price: 0,
      quantity: 1,
      total: 0,
    });
  };

  const calculateItemTotal = (index: number) => {
    const item = form.getValues(`items.${index}`);
    const total = (item.price || 0) * (item.quantity || 0);
    form.setValue(`items.${index}.total`, total, { shouldDirty: true });
  };

  const watchedItems = form.watch('items');
  const watchedTaxRate = form.watch('taxRate');

  const totals = useMemo(() => {
    const subtotal = watchedItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const taxAmount = subtotal * ((watchedTaxRate || 0) / 100);
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  }, [watchedItems, watchedTaxRate]);

  const handleSubmit = async (data: InvoiceFormData) => {
    if (!selectedCustomer) return;
    try {
      await addInvoice({
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        customerEmail: selectedCustomer.email,
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate,
        items: data.items,
        subtotal: totals.subtotal,
        taxRate: data.taxRate,
        taxAmount: totals.taxAmount,
        total: totals.total,
        status: 'draft',
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to create invoice:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="text-[#274268]" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">Create New Invoice</h2>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer *
            </label>
            <select
              {...form.register('customerId')}
              onChange={(e) => handleCustomerChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.email})
                </option>
              ))}
            </select>
            {form.formState.errors.customerId && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.customerId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax Rate (%) *
            </label>
            <input
              type="number"
              step="0.01"
              {...form.register('taxRate', { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
            {form.formState.errors.taxRate && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.taxRate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Date *
            </label>
            <input
              type="date"
              {...form.register('invoiceDate')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {form.formState.errors.invoiceDate && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.invoiceDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date *
            </label>
            <input
              type="date"
              {...form.register('dueDate')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {form.formState.errors.dueDate && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.dueDate.message}</p>
            )}
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Add Item
            </button>
          </div>

          {form.formState.errors.items && !Array.isArray(form.formState.errors.items) && (
            <p className="mb-4 text-sm text-red-600">{form.formState.errors.items.message}</p>
          )}

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-5">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      {...form.register(`items.${index}.name`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Service or product name"
                    />
                    {form.formState.errors.items?.[index]?.name && (
                      <p className="mt-1 text-xs text-red-600">
                        {form.formState.errors.items[index]?.name?.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...form.register(`items.${index}.price`, { valueAsNumber: true })}
                      onChange={() => calculateItemTotal(index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="0.00"
                    />
                    {form.formState.errors.items?.[index]?.price && (
                      <p className="mt-1 text-xs text-red-600">
                        {form.formState.errors.items[index]?.price?.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                      onChange={() => calculateItemTotal(index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="1"
                    />
                    {form.formState.errors.items?.[index]?.quantity && (
                      <p className="mt-1 text-xs text-red-600">
                        {form.formState.errors.items[index]?.quantity?.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Total
                    </label>
                    <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700">
                      ${form.watch(`items.${index}.total`)?.toFixed(2) || '0.00'}
                    </div>
                  </div>

                  <div className="col-span-1 flex items-end">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="max-w-sm ml-auto space-y-3">
            <div className="flex justify-between items-center text-gray-700">
              <span className="font-medium">Subtotal:</span>
              <span className="text-lg font-semibold">${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-700">
              <span className="font-medium">Tax ({form.watch('taxRate') || 0}%):</span>
              <span className="text-lg font-semibold">${totals.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-900 pt-3 border-t-2 border-gray-300">
              <span className="font-bold text-lg">Grand Total:</span>
              <span className="text-2xl font-bold">${totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-[#274268] text-white rounded-lg hover:bg-[#274268]/90 transition-colors font-semibold"
          >
            Create Invoice
          </button>
        </div>
      </form>
    </div>
  );
}
