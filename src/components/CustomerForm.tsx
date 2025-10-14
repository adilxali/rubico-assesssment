import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Check } from 'lucide-react';
import { personalInfoSchema, addressInfoSchema, asyncEmailValidation, type PersonalInfoFormData, type AddressInfoFormData } from '../lib/validation';
import { useStore } from '../store/useStore';
import AddressForm from './steps/AddressForm';
import PersonalForm from './steps/PersonalForm';
import Review from './steps/Review';

interface CustomerFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CustomerForm({ onSuccess, onCancel }: CustomerFormProps) {
  const [step, setStep] = useState(1);
  const [personalData, setPersonalData] = useState<PersonalInfoFormData | null>(null);
  const [addressData, setAddressData] = useState<AddressInfoFormData | null>(null);
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const addCustomer = useStore(state => state.addCustomer);

  const personalForm = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    mode: 'onChange'
  });

  const addressForm = useForm<AddressInfoFormData>({
    resolver: zodResolver(addressInfoSchema),
    mode: 'onChange',
    defaultValues: {
      billingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      },
      shippingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      }
    }
  });

  const handlePersonalSubmit = async (data: PersonalInfoFormData) => {
    const isEmailUnique = await asyncEmailValidation(data.email);
    if (!isEmailUnique) {
      personalForm.setError('email', {
        type: 'manual',
        message: 'This email is already registered'
      });
      return;
    }
    setPersonalData(data);
    setStep(2);
  };

  const handleAddressSubmit = async (data: AddressInfoFormData) => {
    if (!personalData) return;
    try {
      setAddressData(data);
      setStep(3);
    } catch (error) {
      console.error('Failed to create customer:', error);
    }
  };

const handleSameAsShippingChange = (checked: boolean) => {
    setSameAsShipping(checked);
    if (checked) {
      const billing = addressForm.getValues('billingAddress');
      addressForm.setValue('shippingAddress', billing);
    }
  };

  const handleReviewSubmit = async () => {
    try {
      if (!personalData || !addressData) return;

      const shippingAddress = sameAsShipping ? addressData.billingAddress : addressData.shippingAddress;
      await addCustomer({
        ...personalData,
        billingAddress: addressData.billingAddress,
        shippingAddress
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to create customer:', error);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((stepNum) => (
        <div key={stepNum} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              step === stepNum
                ? 'bg-[#274268] text-white'
                : step > stepNum
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step > stepNum ? <Check size={20} /> : stepNum}
          </div>
          {stepNum < 2 && (
            <div
              className={`w-24 h-1 mx-2 transition-all ${
                step > stepNum ? 'bg-green-600' : 'bg-gray-200'
              }`}
            />
          )}
          {stepNum === 2 && (
            <div
              className={`w-24 h-1 mx-2 transition-all ${
                step > stepNum ? 'bg-green-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Customer</h2>

      {renderStepIndicator()}

      {step === 1 && (
        <PersonalForm
          personalForm={personalForm}
          onCancel={onCancel}
          onSubmit={handlePersonalSubmit}
        />
      )}

      {step === 2 && (
        <AddressForm 
        addressForm={addressForm}
        sameAsShipping={sameAsShipping}
        handleSameAsShippingChange={($event) => handleSameAsShippingChange($event)}
        onBack={()=> setStep(1)}
        onSubmit={handleAddressSubmit}
        />
      )}
      {
        step === 3 && (
          <Review
          onBack={() => setStep(2)}
          onSubmit={handleReviewSubmit}
          personalData={personalData}
          addressData={addressData}
          />
        )}
      
    </div>
  );
}
