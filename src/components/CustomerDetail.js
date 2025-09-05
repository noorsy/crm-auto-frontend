import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApi } from '../context/ApiContext';
import CustomerForm from './CustomerForm';
import {
  ArrowLeftIcon,
  PencilIcon,
  CreditCardIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

export default function CustomerDetail() {
  const { id } = useParams();
  const { getCustomer, getCustomerInteractions, loading, error } = useApi();
  const [customer, setCustomer] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    loadCustomer();
  }, [id]);

  const loadCustomer = async () => {
    try {
      const data = await getCustomer(id);
      setCustomer(data);
      
      // Load customer interactions
      try {
        const interactionsData = await getCustomerInteractions(id);
        setInteractions(interactionsData);
      } catch (interactionErr) {
        console.warn('Failed to load interactions:', interactionErr);
        setInteractions([]);
      }
    } catch (err) {
      console.error('Failed to load customer:', err);
    }
  };

  const handleCustomerUpdate = (updatedCustomer) => {
    setCustomer(updatedCustomer);
    loadCustomer(); // Reload to get fresh data including relationships
  };

  if (loading) {
    return (
      <div className="lg:ml-64">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="lg:ml-64">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Customer not found</h3>
            <p className="mt-1 text-sm text-gray-500">The customer you're looking for doesn't exist.</p>
            <div className="mt-6">
              <Link
                to="/customers"
                className="text-primary-600 hover:text-primary-500"
              >
                ← Back to customers
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:ml-64">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center">
              <Link
                to="/customers"
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                  {customer.first_name} {customer.last_name}
                </h2>
                <p className="text-sm text-gray-500">Customer ID: {customer.id}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={() => setShowEditForm(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PencilIcon className="-ml-1 mr-2 h-4 w-4" />
              Edit
            </button>
          </div>
        </div>

        {/* Customer Info Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Personal Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Customer details and contact information
                </p>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Full name</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {customer.first_name} {customer.last_name}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Email address</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                      <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {customer.email_address || customer.email}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                      <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {customer.primary_phone_number || customer.phone || 'N/A'}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Account Number</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {customer.account_number || 'N/A'}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {customer.dob ? new Date(customer.dob).toLocaleDateString() : 'N/A'}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-start">
                      <MapPinIcon className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                      <div>
                        {(customer.address_line_1 || customer.address) && (
                          <>
                            <div>{customer.address_line_1 || customer.address}</div>
                            {customer.address_line_2 && <div>{customer.address_line_2}</div>}
                            <div>
                              {customer.city}, {customer.state} {customer.zip_code}
                            </div>
                          </>
                        )}
                        {!(customer.address_line_1 || customer.address) && 'N/A'}
                      </div>
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">SSN</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {customer.ssn ? `***-**-${customer.ssn.toString().slice(-4)}` : 'N/A'}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Employment Status</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {customer.employment_status || 'N/A'}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Monthly Income</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {customer.monthly_income ? `$${customer.monthly_income.toLocaleString()}` : 'N/A'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Credit Info & Quick Stats */}
          <div className="space-y-6">
            {/* Credit Score */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Credit Information
                </h3>
                <div className="mt-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        customer.credit_score >= 700 
                          ? 'bg-green-100'
                          : customer.credit_score >= 600
                          ? 'bg-yellow-100'
                          : 'bg-red-100'
                      }`}>
                        <span className={`text-lg font-bold ${
                          customer.credit_score >= 700 
                            ? 'text-green-800'
                            : customer.credit_score >= 600
                            ? 'text-yellow-800'
                            : 'text-red-800'
                        }`}>
                          {customer.credit_score || '?'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm text-gray-500">Credit Score</div>
                      <div className={`text-sm font-medium ${
                        customer.credit_score >= 700 
                          ? 'text-green-600'
                          : customer.credit_score >= 600
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}>
                        {customer.credit_score >= 700 
                          ? 'Excellent'
                          : customer.credit_score >= 600
                          ? 'Good'
                          : 'Fair'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Summary */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Account Summary
                </h3>
                <div className="mt-5 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Loans</span>
                    <span className="text-sm font-medium text-gray-900">
                      {customer.loans?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Customer Since</span>
                    <span className="text-sm font-medium text-gray-900">
                      {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loans Section */}
        {customer.loans && customer.loans.length > 0 && (
          <div className="mt-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Active Loans
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Current loan information for this customer
                </p>
              </div>
              <div className="border-t border-gray-200">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Missed Payments
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customer.loans.map((loan) => (
                        <tr key={loan.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                            <Link to={`/loans/${loan.id}`}>
                              {loan.product_name || `Loan #${loan.id}`}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${loan.due_amount?.toLocaleString() || '0'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              loan.no_of_missed_installments === 0 
                                ? 'bg-green-100 text-green-800'
                                : loan.no_of_missed_installments <= 2
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {loan.no_of_missed_installments || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              loan.status === 'current' || loan.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : loan.status === 'past_due' || loan.status === 'arranged'
                                ? 'bg-yellow-100 text-yellow-800'
                                : loan.status === 'delinquent'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {loan.status || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {loan.due_date ? new Date(loan.due_date).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customer Interactions Section */}
        <div className="mt-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Recent Interactions
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Communication history and call outcomes for this customer
              </p>
            </div>
            <div className="border-t border-gray-200">
              {interactions.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-500">
                  No interactions found for this customer
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {interactions.slice(0, 10).map((interaction) => (
                    <div key={interaction.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 w-2 h-2 rounded-full ${
                            interaction.status === 'Completed' || interaction.status === 'Resolved'
                              ? 'bg-green-400'
                              : interaction.status === 'Active' || interaction.status === 'Arranged'
                              ? 'bg-blue-400'
                              : interaction.status === 'No Answer' || interaction.status === 'Sent'
                              ? 'bg-yellow-400'
                              : 'bg-gray-400'
                          }`}></div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {interaction.source}
                            </p>
                            <p className="text-xs text-gray-500">
                              {interaction.creation_date ? new Date(interaction.creation_date).toLocaleString() : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            interaction.status === 'Completed' || interaction.status === 'Resolved'
                              ? 'bg-green-100 text-green-800'
                              : interaction.status === 'Active' || interaction.status === 'Arranged'
                              ? 'bg-blue-100 text-blue-800'
                              : interaction.status === 'No Answer' || interaction.status === 'Sent'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {interaction.status}
                          </span>
                        </div>
                      </div>
                      {interaction.notes && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {interaction.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Edit Form */}
        <CustomerForm
          customer={customer}
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
          onSave={handleCustomerUpdate}
        />
      </div>
    </div>
  );
} 