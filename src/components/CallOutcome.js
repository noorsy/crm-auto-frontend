import React, { useState } from 'react';
import { useApi } from '../context/ApiContext';
import {
  PhoneIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

export default function CallOutcome() {
  const { fetchUserProfilePreCall, postCallOutcomes, loading, error } = useApi();
  const [callerNumber, setCallerNumber] = useState('');
  const [customerData, setCustomerData] = useState(null);
  const [showOutcomeForm, setShowOutcomeForm] = useState(false);
  const [outcomeForm, setOutcomeForm] = useState({
    final_disposition: '',
    user_agreed_payment_amount: '',
    pay_later_date: '',
    contact_type: 'Phone',
    call_duration: '',
    call_type: 'OUTBOUND',
    call_end_status: '',
    notes: ''
  });

  const handleLookup = async () => {
    if (!callerNumber) return;
    
    try {
      const data = await fetchUserProfilePreCall(callerNumber);
      if (data.success === 'True' && data.caller_details.length > 0) {
        setCustomerData(data.caller_details[0]);
        setShowOutcomeForm(true);
      } else {
        alert('Customer not found with this phone number');
      }
    } catch (err) {
      console.error('Failed to fetch customer profile:', err);
      alert('Failed to fetch customer profile');
    }
  };

  const handleSubmitOutcome = async () => {
    if (!customerData) return;

    const payload = {
      user_info: {
        ...customerData.user_info,
        due_amount: outcomeForm.user_agreed_payment_amount ? 
          parseFloat(outcomeForm.user_agreed_payment_amount) : 
          customerData.user_info.due_amount
      },
      outcome_details: {
        ...outcomeForm,
        update_date_time: new Date().toISOString(),
        call_identifier: `CALL${Date.now()}`,
        dialing_status: {
          long_code: 'Dialed - Answered',
          short_code: 'DAN',
          details: 'Customer contact successful'
        }
      },
      call_outcome_note: outcomeForm.notes,
      metadata: {
        creation_date: new Date().toISOString(),
        source: outcomeForm.contact_type,
        status: outcomeForm.final_disposition
      }
    };

    try {
      const result = await postCallOutcomes(payload);
      if (result.success === 'True') {
        alert('Call outcome saved successfully!');
        // Reset form
        setCustomerData(null);
        setShowOutcomeForm(false);
        setOutcomeForm({
          final_disposition: '',
          user_agreed_payment_amount: '',
          pay_later_date: '',
          contact_type: 'Phone',
          call_duration: '',
          call_type: 'OUTBOUND',
          call_end_status: '',
          notes: ''
        });
        setCallerNumber('');
      }
    } catch (err) {
      console.error('Failed to save call outcome:', err);
      alert('Failed to save call outcome');
    }
  };

  return (
    <div className="lg:ml-64">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Call Outcome Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Look up customer profiles and record call outcomes
            </p>
          </div>
        </div>

        {/* Customer Lookup Section */}
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Customer Lookup
            </h3>
            <div className="mt-4 max-w-xl">
              <div className="flex rounded-md shadow-sm">
                <div className="relative flex items-stretch flex-grow focus-within:z-10">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300"
                    placeholder="Enter phone number"
                    value={callerNumber}
                    onChange={(e) => setCallerNumber(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleLookup}
                  disabled={loading || !callerNumber}
                  className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-50"
                >
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  <span>Lookup</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Profile Display */}
        {customerData && (
          <div className="mt-6 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Customer Profile
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <div className="flex items-center">
                    <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-lg font-medium">
                      {customerData.user_info.first_name} {customerData.user_info.last_name}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Account: {customerData.user_info.account_number}</p>
                    <p>Phone: {customerData.user_info.primary_phone_number}</p>
                    <p>Email: {customerData.user_info.email_address}</p>
                  </div>
                </div>
                <div>
                  <div className="text-lg font-medium text-gray-900">
                    Loan Information
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Product: {customerData.user_info.product_name}</p>
                    <p>Due Amount: ${customerData.user_info.due_amount}</p>
                    <p>Missed Payments: {customerData.user_info.no_of_missed_installments}</p>
                    <p>Due Date: {customerData.user_info.due_date}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call Outcome Form */}
        {showOutcomeForm && (
          <div className="mt-6 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Record Call Outcome
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Final Disposition
                  </label>
                  <select
                    value={outcomeForm.final_disposition}
                    onChange={(e) => setOutcomeForm({...outcomeForm, final_disposition: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="">Select disposition</option>
                    <option value="Promise_to_Pay">Promise to Pay</option>
                    <option value="Resolved">Resolved</option>
                    <option value="No_Answer">No Answer</option>
                    <option value="Callback_Scheduled">Callback Scheduled</option>
                    <option value="Refused_to_Pay">Refused to Pay</option>
                    <option value="Dispute">Dispute</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Call Type
                  </label>
                  <select
                    value={outcomeForm.call_type}
                    onChange={(e) => setOutcomeForm({...outcomeForm, call_type: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="OUTBOUND">Outbound</option>
                    <option value="INBOUND">Inbound</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Agreed Payment Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={outcomeForm.user_agreed_payment_amount}
                    onChange={(e) => setOutcomeForm({...outcomeForm, user_agreed_payment_amount: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={outcomeForm.pay_later_date}
                    onChange={(e) => setOutcomeForm({...outcomeForm, pay_later_date: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Call Duration
                  </label>
                  <input
                    type="text"
                    value={outcomeForm.call_duration}
                    onChange={(e) => setOutcomeForm({...outcomeForm, call_duration: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="00:05:30"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Call End Status
                  </label>
                  <select
                    value={outcomeForm.call_end_status}
                    onChange={(e) => setOutcomeForm({...outcomeForm, call_end_status: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="">Select end status</option>
                    <option value="CUSTOMER HANGUP">Customer Hangup</option>
                    <option value="AGENT HANGUP">Agent Hangup</option>
                    <option value="NO ANSWER">No Answer</option>
                    <option value="BUSY">Busy</option>
                    <option value="VOICEMAIL">Voicemail</option>
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Call Notes
                  </label>
                  <textarea
                    rows={4}
                    value={outcomeForm.notes}
                    onChange={(e) => setOutcomeForm({...outcomeForm, notes: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Enter call notes and outcome details..."
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowOutcomeForm(false);
                    setCustomerData(null);
                  }}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitOutcome}
                  disabled={loading || !outcomeForm.final_disposition}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Save Outcome
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <PhoneIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Test Numbers
                    </dt>
                    <dd className="text-xs text-gray-900">
                      5551234567, 5552345678, 5553456789
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Quick Dispositions
                    </dt>
                    <dd className="text-xs text-gray-900">
                      Promise to Pay, Resolved, No Answer
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Customer Scenarios
                    </dt>
                    <dd className="text-xs text-gray-900">
                      Current, Past Due, Delinquent, Default
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 