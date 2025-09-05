import React, { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import {
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

export default function CustomerForm({ customer, isOpen, onClose, onSave }) {
  const { createCustomer, updateCustomer, loading } = useApi();
  const [formData, setFormData] = useState({
    account_number: '',
    first_name: '',
    last_name: '',
    email_address: '',
    primary_phone_number: '',
    ssn: '',
    dob: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    zip_code: '',
    customer_number: '',
    record_type: 'responsible_party',
    borrower_first_name: '',
    borrower_last_name: '',
    is_eligible_to_call: true,
    transfer_phone_number: '',
    transfer_ip_address: '',
    credit_score: '',
    monthly_income: '',
    employment_status: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (customer) {
      // Populate form with existing customer data
      setFormData({
        account_number: customer.account_number || '',
        first_name: customer.first_name || '',
        last_name: customer.last_name || '',
        email_address: customer.email_address || customer.email || '',
        primary_phone_number: customer.primary_phone_number || customer.phone || '',
        ssn: customer.ssn || '',
        dob: customer.dob || '',
        address_line_1: customer.address_line_1 || customer.address || '',
        address_line_2: customer.address_line_2 || '',
        city: customer.city || '',
        state: customer.state || '',
        zip_code: customer.zip_code || '',
        customer_number: customer.customer_number || '',
        record_type: customer.record_type || 'responsible_party',
        borrower_first_name: customer.borrower_first_name || '',
        borrower_last_name: customer.borrower_last_name || '',
        is_eligible_to_call: customer.is_eligible_to_call !== undefined ? customer.is_eligible_to_call : true,
        transfer_phone_number: customer.transfer_phone_number || '',
        transfer_ip_address: customer.transfer_ip_address || '',
        credit_score: customer.credit_score || '',
        monthly_income: customer.monthly_income || '',
        employment_status: customer.employment_status || ''
      });
    } else {
      // Reset form for new customer
      setFormData({
        account_number: '',
        first_name: '',
        last_name: '',
        email_address: '',
        primary_phone_number: '',
        ssn: '',
        dob: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        zip_code: '',
        customer_number: '',
        record_type: 'responsible_party',
        borrower_first_name: '',
        borrower_last_name: '',
        is_eligible_to_call: true,
        transfer_phone_number: '',
        transfer_ip_address: '',
        credit_score: '',
        monthly_income: '',
        employment_status: ''
      });
    }
    setErrors({});
  }, [customer, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email_address.trim()) newErrors.email_address = 'Email is required';
    if (!formData.primary_phone_number) newErrors.primary_phone_number = 'Phone number is required';
    if (!formData.account_number.trim()) newErrors.account_number = 'Account number is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email_address && !emailRegex.test(formData.email_address)) {
      newErrors.email_address = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // Convert numeric fields
      const submitData = {
        ...formData,
        primary_phone_number: parseInt(formData.primary_phone_number) || null,
        ssn: parseInt(formData.ssn) || null,
        zip_code: parseInt(formData.zip_code) || null,
        customer_number: parseInt(formData.customer_number) || null,
        transfer_phone_number: parseInt(formData.transfer_phone_number) || null,
        credit_score: parseInt(formData.credit_score) || null,
        monthly_income: parseFloat(formData.monthly_income) || null,
      };

      let result;
      if (customer) {
        result = await updateCustomer(customer.id, submitData);
      } else {
        result = await createCustomer(submitData);
      }

      onSave(result);
      onClose();
    } catch (error) {
      console.error('Failed to save customer:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {customer ? 'Edit Customer' : 'Add New Customer'}
                    </h3>
                    <button
                      type="button"
                      onClick={onClose}
                      className="bg-white rounded-md text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Personal Information */}
                    <div className="col-span-2">
                      <div className="flex items-center mb-4">
                        <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <h4 className="text-md font-medium text-gray-900">Personal Information</h4>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Account Number *</label>
                      <input
                        type="text"
                        name="account_number"
                        value={formData.account_number}
                        onChange={handleChange}
                        className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.account_number ? 'border-red-300' : ''}`}
                      />
                      {errors.account_number && <p className="mt-1 text-sm text-red-600">{errors.account_number}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Customer Number</label>
                      <input
                        type="number"
                        name="customer_number"
                        value={formData.customer_number}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">First Name *</label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.first_name ? 'border-red-300' : ''}`}
                      />
                      {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.last_name ? 'border-red-300' : ''}`}
                      />
                      {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">SSN</label>
                      <input
                        type="text"
                        name="ssn"
                        value={formData.ssn}
                        onChange={handleChange}
                        placeholder="123456789"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    {/* Contact Information */}
                    <div className="col-span-2">
                      <div className="flex items-center mb-4 mt-6">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <h4 className="text-md font-medium text-gray-900">Contact Information</h4>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                      <input
                        type="email"
                        name="email_address"
                        value={formData.email_address}
                        onChange={handleChange}
                        className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.email_address ? 'border-red-300' : ''}`}
                      />
                      {errors.email_address && <p className="mt-1 text-sm text-red-600">{errors.email_address}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Primary Phone Number *</label>
                      <input
                        type="tel"
                        name="primary_phone_number"
                        value={formData.primary_phone_number}
                        onChange={handleChange}
                        placeholder="5551234567"
                        className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.primary_phone_number ? 'border-red-300' : ''}`}
                      />
                      {errors.primary_phone_number && <p className="mt-1 text-sm text-red-600">{errors.primary_phone_number}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Transfer Phone Number</label>
                      <input
                        type="tel"
                        name="transfer_phone_number"
                        value={formData.transfer_phone_number}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Transfer IP Address</label>
                      <input
                        type="text"
                        name="transfer_ip_address"
                        value={formData.transfer_ip_address}
                        onChange={handleChange}
                        placeholder="192.168.1.100"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    {/* Address Information */}
                    <div className="col-span-2">
                      <div className="flex items-center mb-4 mt-6">
                        <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <h4 className="text-md font-medium text-gray-900">Address Information</h4>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                      <input
                        type="text"
                        name="address_line_1"
                        value={formData.address_line_1}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
                      <input
                        type="text"
                        name="address_line_2"
                        value={formData.address_line_2}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="NY"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                      <input
                        type="text"
                        name="zip_code"
                        value={formData.zip_code}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    {/* Additional Information */}
                    <div className="col-span-2">
                      <div className="flex items-center mb-4 mt-6">
                        <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <h4 className="text-md font-medium text-gray-900">Additional Information</h4>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Record Type</label>
                      <select
                        name="record_type"
                        value={formData.record_type}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      >
                        <option value="responsible_party">Responsible Party</option>
                        <option value="co_signer">Co-Signer</option>
                        <option value="guarantor">Guarantor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Credit Score</label>
                      <input
                        type="number"
                        name="credit_score"
                        value={formData.credit_score}
                        onChange={handleChange}
                        min="300"
                        max="850"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Borrower First Name</label>
                      <input
                        type="text"
                        name="borrower_first_name"
                        value={formData.borrower_first_name}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Borrower Last Name</label>
                      <input
                        type="text"
                        name="borrower_last_name"
                        value={formData.borrower_last_name}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Monthly Income</label>
                      <input
                        type="number"
                        name="monthly_income"
                        value={formData.monthly_income}
                        onChange={handleChange}
                        step="0.01"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Employment Status</label>
                      <select
                        name="employment_status"
                        value={formData.employment_status}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      >
                        <option value="">Select status</option>
                        <option value="employed">Employed</option>
                        <option value="unemployed">Unemployed</option>
                        <option value="self_employed">Self Employed</option>
                        <option value="retired">Retired</option>
                        <option value="student">Student</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <div className="flex items-center">
                        <input
                          id="is_eligible_to_call"
                          name="is_eligible_to_call"
                          type="checkbox"
                          checked={formData.is_eligible_to_call}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="is_eligible_to_call" className="ml-2 block text-sm text-gray-900">
                          Eligible to call
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {loading ? 'Saving...' : (customer ? 'Update Customer' : 'Create Customer')}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 