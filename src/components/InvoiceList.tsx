import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, FileText, Trash2, Calendar, DollarSign } from 'lucide-react';
import { useStore } from '../store/useStore';

interface InvoiceListProps {
  onCreateNew: () => void;
}

type SortField = 'customerName' | 'total' | 'invoiceDate' | 'status';
type SortOrder = 'asc' | 'desc';
const statusFilters = ['all', 'draft', 'sent', 'paid', 'overdue'] as const;
const sortButtons = [
  { field: 'customerName', label: 'Customer' },
  { field: 'invoiceDate', label: 'Date' },
  { field: 'total', label: 'Amount' },
] as const
export default function InvoiceList({ onCreateNew }: InvoiceListProps) {
  const invoices = useStore(state => state.invoices);
  const deleteInvoice = useStore(state => state.deleteInvoice);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('invoiceDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAndSortedInvoices = useMemo(() => {
    let filtered = invoices;

    if (searchTerm) {
      filtered = invoices.filter(
        invoice =>
          invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    return filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === 'customerName') {
        comparison = a.customerName.localeCompare(b.customerName);
      } else if (sortField === 'total') {
        comparison = a.total - b.total;
      } else if (sortField === 'invoiceDate') {
        comparison = new Date(a.invoiceDate).getTime() - new Date(b.invoiceDate).getTime();
      } else if (sortField === 'status') {
        comparison = a.status.localeCompare(b.status);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [invoices, searchTerm, sortField, sortOrder, statusFilter]);

  const totalPages = Math.ceil(filteredAndSortedInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredAndSortedInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      await deleteInvoice(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Invoices</h2>
          <p className="text-gray-600 mt-1">{filteredAndSortedInvoices.length} total invoices</p>
        </div>
        <button
          onClick={onCreateNew}
          className="px-6 py-3 bg-[#274268] text-white rounded-lg hover:bg-[#274268]/90 transition-colors flex items-center gap-2 font-semibold"
        >
          <FileText size={20} />
          Create Invoice
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by customer name, email, or invoice ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            {statusFilters.map((status) => {
              const isActive = statusFilter === status;
              const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors';
              const activeClasses = 'bg-[#274268] text-white';
              const inactiveClasses = 'bg-gray-100 text-gray-700 hover:bg-gray-200';

              return (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setCurrentPage(1);
                  }}
                  className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-4 flex gap-2">
          {sortButtons.map(({ field, label }) => {
            const isActive = sortField === field;
            const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors';
            const activeClasses = 'bg-[#274268] text-white';
            const inactiveClasses = 'bg-gray-100 text-gray-700 hover:bg-gray-200';

            return (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
              >
                {label} {isActive && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            );
          })}
        </div>

        {paginatedInvoices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm || statusFilter !== 'all'
                ? 'No invoices found matching your filters.'
                : 'No invoices yet. Create your first invoice!'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{invoice.customerName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                        {invoice.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} />
                        <span className="text-sm">
                          Invoice: {formatDate(invoice.invoiceDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} />
                        <span className="text-sm">
                          Due: {formatDate(invoice.dueDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign size={16} />
                        <span className="text-sm">
                          {invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-sm">
                          ID: {invoice.id.substring(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-2xl font-bold text-gray-800">
                      ${invoice.total.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleDelete(invoice.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            <span className="text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
