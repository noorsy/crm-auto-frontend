import React, { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import {
  XMarkIcon,
  CreditCardIcon,
  BanknotesIcon,
  CalendarIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

export default function LoanForm({ loan, isOpen, onClose, onSave }) {
  const { createLoan, updateLoan, getCustomers, loading } = useApi();
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customer_id: '',
    product_name: '',
    status: 'active',
    due_amount: '',
    no_of_missed_installments: 0,
    contractual_installment_amount: '',
    interest_late_fee: '',
    minimum_amount: '',
    acceptable_pay_later_date: '',
    acceptable_already_paid_date: '',
    grace_period_date: '',
    due_date: '',
    // Legacy fields (optional)
    vehicle_id: '',
    loan_amount: '',
    interest_rate: '',
    term_months: '',
    monthly_payment: '',
    balance_remaining: '',
    next_payment_date: '',
    origination_date: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadCustomers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (loan) {
      // Populate form with existing loan data
      setFormData({
        customer_id: loan.customer_id || '',
        product_name: loan.product_name || '',
        status: loan.status || 'active',
        due_amount: loan.due_amount || '',
        no_of_missed_installments: loan.no_of_missed_installments || 0,
        contractual_installment_amount: loan.contractual_installment_amount || '',
        interest_late_fee: loan.interest_late_fee || '',
        minimum_amount: loan.minimum_amount || '',
        acceptable_pay_later_date: loan.acceptable_pay_later_date || '',
        acceptable_already_paid_date: loan.acceptable_already_paid_date || '',
        grace_period_date: loan.grace_period_date || '',
        due_date: loan.due_date || '',
        vehicle_id: loan.vehicle_id || '',
        loan_amount: loan.loan_amount || '',
        interest_rate: loan.interest_rate || '',
        term_months: loan.term_months || '',
        monthly_payment: loan.monthly_payment || '',
        balance_remaining: loan.balance_remaining || '',
        next_payment_date: loan.next_payment_date || '',
        origination_date: loan.origination_date || ''
      });
    } else {
      // Reset form for new loan
      setFormData({
        customer_id: '',
        product_name: '',
        status: 'active',
        due_amount: '',
        no_of_missed_installments: 0,
        contractual_installment_amount: '',
        interest_late_fee: '',
        minimum_amount: '',
        acceptable_pay_later_date: '',
        acceptable_already_paid_date: '',
        grace_period_date: '',
        due_date: '',
        vehicle_id: '',
        loan_amount: '',
        interest_rate: '',
        term_months: '',
        monthly_payment: '',
        balance_remaining: '',
        next_payment_date: '',
        origination_date: ''
      });
    }
    setErrors({});
  }, [loan, isOpen]);

  const loadCustomers = async () => {
    try {
      const customersData = await getCustomers();
      setCustomers(customersData);
    } catch (error) {
      console.error('Failed to load customers:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customer_id) newErrors.customer_id = 'Customer is required';
    if (!formData.product_name.trim()) newErrors.product_name = 'Product name is required';
    if (!formData.due_amount) newErrors.due_amount = 'Due amount is required';
    if (!formData.contractual_installment_amount) newErrors.contractual_installment_amount = 'Contractual installment amount is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // Convert numeric fields and prepare data
      const submitData = {
        ...formData,
        customer_id: parseInt(formData.customer_id),
        due_amount: parseFloat(formData.due_amount) || null,
        no_of_missed_installments: parseInt(formData.no_of_missed_installments) || 0,
        contractual_installment_amount: parseFloat(formData.contractual_installment_amount) || null,
        interest_late_fee: parseFloat(formData.interest_late_fee) || null,
        minimum_amount: parseFloat(formData.minimum_amount) || null,
        // Legacy fields
        loan_amount: parseFloat(formData.loan_amount) || null,
        interest_rate: parseFloat(formData.interest_rate) || null,
        term_months: parseInt(formData.term_months) || null,
        monthly_payment: parseFloat(formData.monthly_payment) || null,
        balance_remaining: parseFloat(formData.balance_remaining) || null,
      };

      let result;
      if (loan) {
        result = await updateLoan(loan.id, submitData);
      } else {
        result = await createLoan(submitData);
      }

      onSave(result);
      onClose();
    } catch (error) {
      console.error('Failed to save loan:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
                      {loan ? 'Edit Loan' : 'Add New Loan'}
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
                    {/* Basic Loan Information */}
                    <div className="col-span-2">
                      <div className="flex items-center mb-4">
                        <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <h4 className="text-md font-medium text-gray-900">Basic Information</h4>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Customer *</label>
                      <select
                        name="customer_id"
                        value={formData.customer_id}
                        onChange={handleChange}
                        className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.customer_id ? 'border-red-300' : ''}`}
                      >
                        <option value="">Select a customer</option>
                        {customers.map(customer => (
                          <option key={customer.id} value={customer.id}>
                            {customer.first_name} {customer.last_name} ({customer.account_number || customer.id})
                          </option>
                        ))}
                      </select>
                      {errors.customer_id && <p className="mt-1 text-sm text-red-600">{errors.customer_id}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                      <input
                        type="text"
                        name="product_name"
                        value={formData.product_name}
                        onChange={handleChange}
                        placeholder="Auto Loan, Personal Loan, etc."
                        className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.product_name ? 'border-red-300' : ''}`}
                      />
                      {errors.product_name && <p className="mt-1 text-sm text-red-600">{errors.product_name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="current">Current</option>
                        <option value="past_due">Past Due</option>
                        <option value="arranged">Arranged</option>
                        <option value="delinquent">Delinquent</option>
                        <option value="default">Default</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Vehicle ID</label>
                      <input
                        type="text"
                        name="vehicle_id"
                        value={formData.vehicle_id}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    {/* Payment Information */}
                    <div className="col-span-2">
                      <div className="flex items-center mb-4 mt-6">
                        <BanknotesIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <h4 className="text-md font-medium text-gray-900">Payment Information</h4>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Due Amount *</label>
                      <input
                        type="number"
                        name="due_amount"
                        value={formData.due_amount}
                        onChange={handleChange}
                        step="0.01"
                        className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.due_amount ? 'border-red-300' : ''}`}
                      />
                      {errors.due_amount && <p className="mt-1 text-sm text-red-600">{errors.due_amount}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Missed Installments</label>
                      <input
                        type="number"
                        name="no_of_missed_installments"
                        value={formData.no_of_missed_installments}
                        onChange={handleChange}
                        min="0"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contractual Installment Amount *</label>
                      <input
                        type="number"
                        name="contractual_installment_amount"
                        value={formData.contractual_installment_amount}
                        onChange={handleChange}
                        step="0.01"
                        className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.contractual_installment_amount ? 'border-red-300' : ''}`}
                      />
                      {errors.contractual_installment_amount && <p className="mt-1 text-sm text-red-600">{errors.contractual_installment_amount}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Interest Late Fee</label>
                      <input
                        type="number"
                        name="interest_late_fee"
                        value={formData.interest_late_fee}
                        onChange={handleChange}
                        step="0.01"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Minimum Amount</label>
                      <input
                        type="number"
                        name="minimum_amount"
                        value={formData.minimum_amount}
                        onChange={handleChange}
                        step="0.01"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    {/* Date Information */}
                    <div className="col-span-2">
                      <div className="flex items-center mb-4 mt-6">
                        <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <h4 className="text-md font-medium text-gray-900">Important Dates</h4>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Due Date</label>
                      <input
                        type="date"
                        name="due_date"
                        value={formData.due_date}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Grace Period Date</label>
                      <input
                        type="date"
                        name="grace_period_date"
                        value={formData.grace_period_date}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Acceptable Pay Later Date</label>
                      <input
                        type="date"
                        name="acceptable_pay_later_date"
                        value={formData.acceptable_pay_later_date}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Acceptable Already Paid Date</label>
                      <input
                        type="date"
                        name="acceptable_already_paid_date"
                        value={formData.acceptable_already_paid_date}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    {/* Legacy Fields */}
                    <div className="col-span-2">
                      <div className="flex items-center mb-4 mt-6">
                        <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <h4 className="text-md font-medium text-gray-900">Legacy Loan Information (Optional)</h4>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Loan Amount</label>
                      <input
                        type="number"
                        name="loan_amount"
                        value={formData.loan_amount}
                        onChange={handleChange}
                        step="0.01"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
                      <input
                        type="number"
                        name="interest_rate"
                        value={formData.interest_rate}
                        onChange={handleChange}
                        step="0.01"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Term (Months)</label>
                      <input
                        type="number"
                        name="term_months"
                        value={formData.term_months}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Monthly Payment</label>
                      <input
                        type="number"
                        name="monthly_payment"
                        value={formData.monthly_payment}
                        onChange={handleChange}
                        step="0.01"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Balance Remaining</label>
                      <input
                        type="number"
                        name="balance_remaining"
                        value={formData.balance_remaining}
                        onChange={handleChange}
                        step="0.01"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Next Payment Date</label>
                      <input
                        type="date"
                        name="next_payment_date"
                        value={formData.next_payment_date}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Origination Date</label>
                      <input
                        type="date"
                        name="origination_date"
                        value={formData.origination_date}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
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
                {loading ? 'Saving...' : (loan ? 'Update Loan' : 'Create Loan')}
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