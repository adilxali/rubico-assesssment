import { useState, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Trash2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Customer } from "../lib/db";
import { useStore } from "../store/useStore";

interface CustomerListProps {
  onCreateNew: () => void;
  onSelectCustomer?: (customer: Customer) => void;
}

type SortField = "name" | "email" | "createdAt";
type SortOrder = "asc" | "desc";

const sortButtons = [
  { field: "name", label: "Name", activeClass: "bg-[#274268] text-white" },
  { field: "email", label: "Email", activeClass: "bg-[#274268] text-white" },
  { field: "createdAt", label: "Date", activeClass: "bg-[#274268] text-white" },
];

export default function CustomerList({
  onCreateNew,
  onSelectCustomer,
}: CustomerListProps) {
  const customers = useStore((state) => state.customers);
  const deleteCustomer = useStore((state) => state.deleteCustomer);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customers;

    if (searchTerm) {
      filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "email") {
        comparison = a.email.localeCompare(b.email);
      } else if (sortField === "createdAt") {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [customers, searchTerm, sortField, sortOrder]);

  const totalPages = Math.ceil(
    filteredAndSortedCustomers.length / itemsPerPage
  );
  const paginatedCustomers = filteredAndSortedCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      await deleteCustomer(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
          <p className="text-gray-600 mt-1">
            {filteredAndSortedCustomers.length} total customers
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="px-6 py-3 bg-[#274268] text-white rounded-lg hover:bg-[#274268]/90 transition-colors flex items-center gap-2 font-semibold"
        >
          <UserPlus size={20} />
          Add Customer
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274268] focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="mb-4 flex gap-2">
            {sortButtons.map(({ field, label, activeClass }) => {
              const isActive = sortField === field;
              const baseClasses =
                "px-4 py-2 rounded-lg font-medium transition-colors";
              const inactiveClasses =
                "bg-gray-100 text-gray-700 hover:bg-gray-200";

              return (
                <button
                  key={field}
                  onClick={() => handleSort(field as SortField)}
                  className={`${baseClasses} ${
                    isActive ? activeClass : inactiveClasses
                  }`}
                >
                  {label} {isActive && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              );
            })}
          </div>
          <div>
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#274268] focus:border-transparent"
            onChange={(e)=> setItemsPerPage(Number(e.target.value))} value={itemsPerPage}
            >
              <option value={1}>1</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {paginatedCustomers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm
                ? "No customers found matching your search."
                : "No customers yet. Create your first customer!"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedCustomers.map((customer) => (
              <div
                key={customer.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onSelectCustomer?.(customer)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {customer.name}
                    </h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={16} />
                        <span className="text-sm">{customer.email}</span>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={16} />
                          <span className="text-sm">{customer.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin size={16} />
                        <span className="text-sm">
                          {customer.billingAddress.city},{" "}
                          {customer.billingAddress.state}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-500">
                      Added {formatDate(customer.createdAt)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(customer.id);
                      }}
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
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
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
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
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
