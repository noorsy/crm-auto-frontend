import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApi } from '../context/ApiContext';
import {
  ArrowLeftIcon,
  TruckIcon,
  CreditCardIcon,
  CalendarIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

export default function LoanDetail() {
  const { id } = useParams();
  const { getLoan, loading, error } = useApi();
  const [loan, setLoan] = useState(null);

  useEffect(() => {
    loadLoan();
  }, [id]);

  const loadLoan = async () => {
    try {
      // Since we don't have a getLoan endpoint yet, we'll simulate it
      // In a real app, you'd implement the backend endpoint
      setLoan({
        id: id,
        customer: "John Doe",
        vehicle: "2019 Toyota Camry",
        loan_amount: 25000,
        balance_remaining: 18500,
        interest_rate: 4.5,
        term_months: 60,
        monthly_payment: 465.50,
        status: "active",
        days_past_due: 0,
        next_payment_date: "2024-02-15",
        origination_date: "2021-08-15",
        // Vehicle details
        vehicle_details: {
          vin: "1HGBH41JXMN109186",
          make: "Toyota",
          model: "Camry",
          year: 2019,
          mileage: 45000,
          color: "Silver",
          condition: "Good"
        },
        // Payment history (mock data)
        payment_history: [
          { id: 1, amount: 465.50, date: "2024-01-15", method: "ACH", status: "processed" },
          { id: 2, amount: 465.50, date: "2023-12-15", method: "ACH", status: "processed" },
          { id: 3, amount: 465.50, date: "2023-11-15", method: "Check", status: "processed" },
        ]
      });
    } catch (err) {
      console.error('Failed to load loan:', err);
    }
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

  if (!loan) {
    return (
      <div className="lg:ml-64">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Loan not found</h3>
            <p className="mt-1 text-sm text-gray-500">The loan you're looking for doesn't exist.</p>
            <div className="mt-6">
              <Link
                to="/loans"
                className="text-primary-600 hover:text-primary-500"
              >
                ← Back to loans
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
                to="/loans"
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                  Loan #{loan.id}
                </h2>
                <p className="text-sm text-gray-500">Customer: {loan.customer}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <BanknotesIcon className="-ml-1 mr-2 h-4 w-4" />
              Record Payment
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Generate Statement
            </button>
          </div>
        </div>

        {/* Loan Summary Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CreditCardIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Original Amount</dt>
                    <dd className="text-lg font-medium text-gray-900">${loan.loan_amount?.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BanknotesIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Balance Remaining</dt>
                    <dd className="text-lg font-medium text-gray-900">${loan.balance_remaining?.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Monthly Payment</dt>
                    <dd className="text-lg font-medium text-gray-900">${loan.monthly_payment?.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-6 h-6 rounded-full ${
                    loan.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                  } flex items-center justify-center`}>
                    <div className={`w-2 h-2 rounded-full ${
                      loan.status === 'active' ? 'bg-green-600' : 'bg-gray-600'
                    }`}></div>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Status</dt>
                    <dd className="text-lg font-medium text-gray-900 capitalize">{loan.status}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Loan Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Loan Information */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Loan Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Detailed loan terms and conditions
                </p>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Interest Rate</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {loan.interest_rate}% APR
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Loan Term</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {loan.term_months} months
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Origination Date</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {new Date(loan.origination_date).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Next Payment Due</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {new Date(loan.next_payment_date).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Days Past Due</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        loan.days_past_due > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {loan.days_past_due > 0 ? `${loan.days_past_due} days` : 'Current'}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Payment History
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Recent payment transactions
                </p>
              </div>
              <div className="border-t border-gray-200">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loan.payment_history.map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(payment.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${payment.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.method}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Vehicle Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Details about the financed vehicle
                </p>
              </div>
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center mb-4">
                    <TruckIcon className="h-12 w-12 text-gray-400" />
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        {loan.vehicle_details.year} {loan.vehicle_details.make} {loan.vehicle_details.model}
                      </h4>
                      <p className="text-sm text-gray-500">VIN: {loan.vehicle_details.vin}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Mileage</span>
                      <span className="text-sm font-medium text-gray-900">
                        {loan.vehicle_details.mileage?.toLocaleString()} miles
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Color</span>
                      <span className="text-sm font-medium text-gray-900">
                        {loan.vehicle_details.color}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Condition</span>
                      <span className="text-sm font-medium text-gray-900">
                        {loan.vehicle_details.condition}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 