import { useForm } from 'react-hook-form';
import {  type PersonalInfoFormData } from '../../lib/validation';
import { ChevronRight } from 'lucide-react';

interface PersonalFormProps {
  onCancel: () => void;
  onSubmit: (data: PersonalInfoFormData) => void;
  personalForm: ReturnType<typeof useForm<PersonalInfoFormData>>;
}

export default function PersonalForm({
  onCancel,
  onSubmit,
  personalForm
}: PersonalFormProps) {
    return (
        <form onSubmit={personalForm.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                {...personalForm.register('name')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274268] focus:border-transparent"
                placeholder="John Doe"
              />
              {personalForm.formState.errors.name && (
                <p className="mt-1 text-sm text-red-600">{personalForm.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                {...personalForm.register('email')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274268] focus:border-transparent"
                placeholder="john@example.com"
              />
              {personalForm.formState.errors.email && (
                <p className="mt-1 text-sm text-red-600">{personalForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                {...personalForm.register('phone')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274268] focus:border-transparent"
                placeholder="+91XXXXXXXXXX"
              />
              {personalForm.formState.errors.phone && (
                <p className="mt-1 text-sm text-red-600">{personalForm.formState.errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
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
    );
}