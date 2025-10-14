import { ChevronLeft, Check } from 'lucide-react';
import { type PersonalInfoFormData, type AddressInfoFormData } from '../../lib/validation';

interface ReviewProps {
    onBack: () => void;
    onSubmit: () => void;
    personalData: PersonalInfoFormData | null;
    addressData: AddressInfoFormData | null;
}

export default function Review({
    onBack,
    onSubmit,
    personalData,
    addressData,
}: ReviewProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Review Details</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium text-gray-800">Personal Information</h4>
                <p><span className="font-semibold">Name:</span> {personalData?.name}</p>
                <p><span className="font-semibold">Email:</span> {personalData?.email}</p>
                {personalData?.phone && <p><span className="font-semibold">Phone:</span> {personalData.phone}</p>}
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-800">Billing Address</h4>
                <p>{addressData?.billingAddress.street}</p>
                <p>{`${addressData?.billingAddress.city}, ${addressData?.billingAddress.state} ${addressData?.billingAddress.zipCode}`}</p>
                <p>{addressData?.billingAddress.country}</p>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-800">Shipping Address</h4>
                <p>{addressData?.shippingAddress.street}</p>
                <p>{`${addressData?.shippingAddress.city}, ${addressData?.shippingAddress.state} ${addressData?.shippingAddress.zipCode}`}</p>
                <p>{addressData?.shippingAddress.country}</p>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <ChevronLeft size={18} />
                Back
              </button>
              <button
                type="button"
                onClick={onSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                Confirm & Create
                <Check size={18} />
              </button>
            </div>
          </div>
    )
}