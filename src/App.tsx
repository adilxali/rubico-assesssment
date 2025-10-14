import { useEffect, useState } from 'react';
import { Users, FileText, LayoutDashboard } from 'lucide-react';
import { useStore } from './store/useStore';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import InvoiceList from './components/InvoiceList';
import InvoiceForm from './components/InvoiceForm';
import QuickAction from './components/QuickAction';
import { Customer } from './lib/db';

type View = 'dashboard' | 'customers' | 'customer-form' | 'invoices' | 'invoice-form';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const { loadCustomers, loadInvoices, customers, invoices } = useStore();

  useEffect(() => {
    loadCustomers();
    loadInvoices();
  }, [loadCustomers, loadInvoices]);

  const stats = {
    totalCustomers: customers.length,
    totalInvoices: invoices.length,
    totalRevenue: invoices.reduce((sum, inv) => sum + inv.total, 0),
    paidInvoices: invoices.filter(inv => inv.status === 'paid').length
  };

  const renderNavigation = () => (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={()=>{
            setCurrentView('dashboard')
          }}>            
            <img src="https://rubicostgind.wpengine.com/wp-content/uploads/2024/10/Navbar-1.svg" alt="Rubico Billing" className="h-6 w-auto" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setCurrentView('dashboard');
                setSelectedCustomer(null);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                currentView === 'dashboard'
                  ? 'bg-[#274268] text-white'
                  : 'text-[#274268] hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            <button
              onClick={() => {
                setCurrentView('customers');
                setSelectedCustomer(null);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                currentView === 'customers' || currentView === 'customer-form'
                  ? 'bg-[#274268] text-white'
                  : 'text-[#274268] hover:bg-gray-100'
              }`}
            >
              <Users size={18} />
              Customers
            </button>
            <button
              onClick={() => {
                setCurrentView('invoices');
                setSelectedCustomer(null);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                currentView === 'invoices' || currentView === 'invoice-form'
                  ? 'bg-[#274268] text-white'
                  : 'text-[#274268] hover:bg-gray-100'
              }`}
            >
              <FileText size={18} />
              Invoices
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-600 mt-1">Overview of your business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Customers</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalCustomers}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="text-[#274268]" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Invoices</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalInvoices}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FileText className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-yellow-600 text-2xl font-bold">$</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Paid Invoices</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.paidInvoices}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <FileText className="text-emerald-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Customers</h3>
          {customers.slice(0, 5).length === 0 ? (
            <p className="text-gray-500">No customers yet</p>
          ) : (
            <div className="space-y-3">
              {customers.slice(0, 5).map((customer) => (
                <div
                  key={customer.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setCurrentView('customers');
                  }}
                >
                  <div>
                    <p className="font-semibold text-gray-800">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Invoices</h3>
          {invoices.slice(0, 5).length === 0 ? (
            <p className="text-gray-500">No invoices yet</p>
          ) : (
            <div className="space-y-3">
              {invoices.slice(0, 5).map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setCurrentView('invoices')}
                >
                  <div>
                    <p className="font-semibold text-gray-800">{invoice.customerName}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(invoice.invoiceDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">${invoice.total.toFixed(2)}</p>
                    <p className="text-xs text-gray-600 capitalize">{invoice.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <QuickAction
      onAddCustomer={($event)=>setCurrentView($event)}
      onCreateInvoice={($event)=>setCurrentView($event)}

      />
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'customers':
        return (
          <CustomerList
            onCreateNew={() => setCurrentView('customer-form')}
            onSelectCustomer={(customer) => {
              setSelectedCustomer(customer);
            }}
          />
        );
      case 'customer-form':
        return (
          <CustomerForm
            onSuccess={() => {
              setCurrentView('customers');
              setSelectedCustomer(null);
            }}
            onCancel={() => {
              setCurrentView('customers');
              setSelectedCustomer(null);
            }}
          />
        );
      case 'invoices':
        return <InvoiceList onCreateNew={() => setCurrentView('invoice-form')} />;
      case 'invoice-form':
        return (
          <InvoiceForm
            onSuccess={() => {
              setCurrentView('invoices');
              setSelectedCustomer(null);
            }}
            onCancel={() => {
              setCurrentView('invoices');
              setSelectedCustomer(null);
            }}
            preselectedCustomer={selectedCustomer || undefined}
          />
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderNavigation()}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
