
import { useForm } from 'react-hook-form';
import {  type AddressInfoFormData } from '../../lib/validation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AddressFormProps {
  onBack: () => void;
  onSubmit: (data: AddressInfoFormData) => void;
  addressForm: ReturnType<typeof useForm<AddressInfoFormData>>;
  sameAsShipping: boolean;
  handleSameAsShippingChange: (checked: boolean) => void;
}

export default function AddressForm({
  onBack,
  onSubmit,
  addressForm,
  sameAsShipping,
  handleSameAsShippingChange
}: AddressFormProps) {

    return (
        <form onSubmit={addressForm.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Billing Address</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street *</label>
              <input
                type="text"
                {...addressForm.register('billingAddress.street')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274268] focus:border-transparent"
                placeholder="123 Main St"
              />
              {addressForm.formState.errors.billingAddress?.street && (
                <p className="mt-1 text-sm text-red-600">{addressForm.formState.errors.billingAddress.street.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  {...addressForm.register('billingAddress.city')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274268] focus:border-transparent"
                  placeholder="Dehradun"
                />
                {addressForm.formState.errors.billingAddress?.city && (
                  <p className="mt-1 text-sm text-red-600">{addressForm.formState.errors.billingAddress.city.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  {...addressForm.register('billingAddress.state')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274268] focus:border-transparent"
                  placeholder="Uttarakhand"
                />
                {addressForm.formState.errors.billingAddress?.state && (
                  <p className="mt-1 text-sm text-red-600">{addressForm.formState.errors.billingAddress.state.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                <input
                  type="text"
                  {...addressForm.register('billingAddress.zipCode')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274268] focus:border-transparent"
                  placeholder="248001"
                />
                {addressForm.formState.errors.billingAddress?.zipCode && (
                  <p className="mt-1 text-sm text-red-600">{addressForm.formState.errors.billingAddress.zipCode.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                <input
                  type="text"
                  {...addressForm.register('billingAddress.country')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274268] focus:border-transparent"
                  placeholder="India"
                />
                {addressForm.formState.errors.billingAddress?.country && (
                  <p className="mt-1 text-sm text-red-600">{addressForm.formState.errors.billingAddress.country.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 py-2">
            <input
              type="checkbox"
              id="sameAsShipping"
              checked={sameAsShipping}
              onChange={(e) => handleSameAsShippingChange(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-[#274268]"
            />
            <label htmlFor="sameAsShipping" className="text-sm font-medium text-gray-700">
              Shipping address same as billing
            </label>
          </div>

          {!sameAsShipping && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Shipping Address</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street *</label>
                <input
                  type="text"
                  {...addressForm.register('shippingAddress.street')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274268] focus:border-transparent"
                  placeholder="456 Oak Ave"
                />
                {addressForm.formState.errors.shippingAddress?.street && (
                  <p className="mt-1 text-sm text-red-600">{addressForm.formState.errors.shippingAddress.street.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    {...addressForm.register('shippingAddress.city')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274268] focus:border-transparent"
                    placeholder="Roorkee"
                  />
                  {addressForm.formState.errors.shippingAddress?.city && (
                    <p className="mt-1 text-sm text-red-600">{addressForm.formState.errors.shippingAddress.city.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    {...addressForm.register('shippingAddress.state')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274268] focus:border-transparent"
                    placeholder="Uttarakhand"
                  />
                  {addressForm.formState.errors.shippingAddress?.state && (
                    <p className="mt-1 text-sm text-red-600">{addressForm.formState.errors.shippingAddress.state.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                  <input
                    type="text"
                    {...addressForm.register('shippingAddress.zipCode')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274268] focus:border-transparent"
                    placeholder="247667"
                  />
                  {addressForm.formState.errors.shippingAddress?.zipCode && (
                    <p className="mt-1 text-sm text-red-600">{addressForm.formState.errors.shippingAddress.zipCode.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <input
                    type="text"
                    {...addressForm.register('shippingAddress.country')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274268] focus:border-transparent"
                    placeholder="India"
                  />
                  {addressForm.formState.errors.shippingAddress?.country && (
                    <p className="mt-1 text-sm text-red-600">{addressForm.formState.errors.shippingAddress.country.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => onBack()}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <ChevronLeft size={18} />
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#274268] text-white rounded-lg hover:bg-[#274268]/90 transition-colors flex items-center gap-2"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </form>
    )
}