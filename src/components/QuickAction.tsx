import { Users, FileText } from "lucide-react"

interface QuickActionProps {
    onAddCustomer: (view: 'customer-form') => void;
    onCreateInvoice: (view: 'invoice-form') => void;
}
export default function QuickAction({
    onAddCustomer,
    onCreateInvoice
}: QuickActionProps) {
    return (<div className="bg-gradient-to-r from-[#0d1623] to-[#0d1623]/80 rounded-lg shadow-md p-8 text-white">
        <h3 className="text-2xl font-bold mb-2">Quick Actions</h3>
        <p className="text-blue-100 mb-6">Get started with your billing workflow</p>
        <div className="flex gap-4">
            <button
                onClick={() => onAddCustomer('customer-form')}
                className="px-6 py-3 bg-white text-[#274268] rounded-lg hover:bg-blue-50 transition-colors font-semibold flex items-center gap-2"
            >
                <Users size={20} />
                Add Customer
            </button>
            <button
                onClick={() => onCreateInvoice('invoice-form')}
                className="px-6 py-3 bg-[#274268] text-white rounded-lg hover:bg-[#274268]/70 transition-colors font-semibold flex items-center gap-2"
            >
                <FileText size={20} />
                Create Invoice
            </button>
        </div>
    </div>)

}